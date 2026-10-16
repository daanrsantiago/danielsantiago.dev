import { getPosts } from '@/app/utils/utils';
import { Flex } from '@/once-ui/components';

import { ProjectCard } from '@/components';
import { ProjectCarousel } from '@/components/work/ProjectCarousel';

interface ProjectsProps {
    range?: [number, number?];
    locale: string;
    carousel?: boolean;
}

export function Projects({ range, locale, carousel = false }: ProjectsProps) {
    let allProjects = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);

    const sortedProjects = allProjects.sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const displayedProjects = range
        ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
        : sortedProjects;

    if (carousel) {
        return (
            <Flex
                fillWidth marginBottom="40" paddingX="l">
                <ProjectCarousel
                    projects={displayedProjects.map((post) => ({
                        slug: post.slug,
                        href: `work/${post.slug}`,
                        image: post.metadata.images[0],
                        title: post.metadata.title,
                        description: post.metadata.summary,
                        avatars: post.metadata.team?.map((member) => ({ src: member.avatar })) || [],
                        hasContent: !!post.content?.trim(),
                    }))}/>
            </Flex>
        );
    }

    return (
        <Flex
            fillWidth gap="xl" marginBottom="40" paddingX="l"
            direction="column">
            {displayedProjects.map((post) => (
                <ProjectCard
                    key={post.slug}
                    href={`work/${post.slug}`}
                    images={post.metadata.images}
                    title={post.metadata.title}
                    description={post.metadata.summary}
                    content={post.content}
                    avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}/>
            ))}
        </Flex>
    );
}
