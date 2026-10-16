"use client";

import { useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import { Flex, IconButton, SmartImage } from "@/once-ui/components";
import { ProjectCardInfo } from "@/components/ProjectCard";

import styles from "./ProjectCarousel.module.scss";

export interface CarouselProject {
    slug: string;
    href: string;
    image?: string;
    title: string;
    description: string;
    avatars: { src: string }[];
    hasContent: boolean;
}

interface ProjectCarouselProps {
    projects: CarouselProject[];
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const t = useTranslations();

    if (projects.length === 0) return null;

    const active = projects[activeIndex];
    const hasMultiple = projects.length > 1;

    const goTo = (index: number) => {
        if (index >= 0 && index < projects.length) {
            setActiveIndex(index);
        }
    };

    return (
        <Flex
            fillWidth
            direction="column"
            gap="m"
            className={styles.root}>
            <div className={styles.viewport}>
                <div
                    className={styles.track}
                    style={{ transform: `translateX(calc(${-activeIndex} * (100% + var(--carousel-gap))))` }}>
                    {projects.map((project, index) => {
                        const isActive = index === activeIndex;
                        const image = project.image && (
                            <SmartImage
                                radius="l"
                                alt={project.title}
                                aspectRatio="16 / 9"
                                src={project.image}
                                style={{ border: '1px solid var(--neutral-alpha-weak)' }}/>
                        );

                        return (
                            <div
                                key={project.slug}
                                className={classNames(styles.slide, !isActive && styles.inactive)}
                                aria-hidden={!isActive}
                                onClick={isActive ? undefined : () => goTo(index)}>
                                {isActive && project.hasContent
                                    ? <Link href={project.href} className={styles.imageLink}>{image}</Link>
                                    : image}
                            </div>
                        );
                    })}
                </div>
                {hasMultiple && (
                    <>
                        <IconButton
                            className={classNames(styles.arrow, styles.previous)}
                            icon="chevronLeft"
                            variant="secondary"
                            tooltip={t("projectCarousel.previous")}
                            disabled={activeIndex === 0}
                            onClick={() => goTo(activeIndex - 1)}/>
                        <IconButton
                            className={classNames(styles.arrow, styles.next)}
                            icon="chevronRight"
                            variant="secondary"
                            tooltip={t("projectCarousel.next")}
                            disabled={activeIndex === projects.length - 1}
                            onClick={() => goTo(activeIndex + 1)}/>
                    </>
                )}
            </div>
            {hasMultiple && (
                <Flex
                    gap="4" paddingX="s"
                    fillWidth
                    justifyContent="center">
                    {projects.map((project, index) => (
                        <button
                            key={project.slug}
                            type="button"
                            className={classNames(styles.dot, index === activeIndex && styles.activeDot)}
                            aria-label={project.title}
                            aria-current={index === activeIndex}
                            onClick={() => goTo(index)}/>
                    ))}
                </Flex>
            )}
            <div key={active.slug} className={styles.info}>
                <ProjectCardInfo
                    href={active.href}
                    title={active.title}
                    description={active.description}
                    avatars={active.avatars}
                    showLink={active.hasContent}/>
            </div>
        </Flex>
    );
};
