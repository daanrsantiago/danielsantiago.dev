import { InlineCode } from "@/once-ui/components";

const workExperiences = ["Zup"]
const studiesInsitutions = ["UFU"]
const skills = ["Figma"]

const createI18nContent = (t) => {
    const person = {
        firstName: 'Daniel',
        lastName:  'Ribeiro Santiago',
        get name() {
            return `${this.firstName} ${this.lastName}`;
        },
        role:      t("person.role"),
        avatar:    '/images/avatar.png',
        location:  'America/Sao_Paulo',        // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
        languages: ['Portugês (Brasileiro)', 'English']  // optional: Leave the array empty if you don't want to display languages
    }

    const newsletter = {
        display: false,
        title: <>{t("newsletter.title", {firstName: person.firstName})}</>,
        description: <>{t("newsletter.description")}</>
    }

    const social = [
        // Links are automatically displayed.
        // Import new icons in /once-ui/icons.ts
        {
            name: 'GitHub',
            icon: 'github',
            link: 'https://github.com/daanrsantiago',
        },
        {
            name: 'LinkedIn',
            icon: 'linkedin',
            link: 'https://www.linkedin.com/in/daniel-ribeiro-santiago/',
        },
        {
            name: 'Email',
            icon: 'email',
            link: 'mailto:daanrsantiago@gmail.com',
        },
    ]

    const home = {
        label: t("home.label"),
        title: t("home.title", {name: person.name}),
        description: t("home.description", {role: person.role}),
        headline: <>{t("home.headline")}</>,
        subline: <>{t("home.subline")}</>,
        blogCall: t("home.blogCall")
    }

    const about = {
        label: t("about.label"),
        title: t("about.title"),
        description: t("about.description", {name: person.name, role: person.role, location: person.location}),
        callSchedule: t("about.callSchedule"),
        tableOfContent: {
            display: true,
            subItems: true
        },
        avatar: {
            display: true
        },
        calendar: {
            display: false,
            link: 'https://cal.com'
        },
        intro: {
            display: true,
            title: t("about.intro.title"),
            description: <>{t("about.intro.description")}</>
        },
        work: {
            display: true, // set to false to hide this section
            title: t("about.work.title"),
            experiences: workExperiences.map( workExperience => {
                return {
                        company: workExperience,
                        timeframe: t(`about.work.experiences.${workExperience}.timeframe`),
                        role: t(`about.work.experiences.${workExperience}.role`),
                        achievements: t.rich(`about.work.experiences.${workExperience}.achievements`).split(";"),
                        images: [ // optional: leave the array empty if you don't want to display images
                            // {
                            //     src: '/images/projects/project-01/cover-01.jpg',
                            //     alt: 'Once UI Project',
                            //     width: 16,
                            //     height: 9
                            // }
                        ]
                }
            })
        },
        studies: {
            display: true, // set to false to hide this section
            title: t("about.studies.title"),
            institutions: studiesInsitutions.map( institution => {
                return {
                    name: t(`about.studies.institutions.${institution}.name`),
                    description: <>{t(`about.studies.institutions.${institution}.description`)}</>,
                }
            })
        },
        technical: {
            display: false, // set to false to hide this section
            title: t("about.technical.title"),
            skills: skills.map( skill => {
                return {
                    title: skill,
                    description: <>{t(`about.technical.skills.${skill}.description`)}</>,
                    images: [
                        {
                            src: '/images/projects/project-01/cover-02.jpg',
                            alt: 'Project image',
                            width: 16,
                            height: 9
                        },
                        {
                            src: '/images/projects/project-01/cover-03.jpg',
                            alt: 'Project image',
                            width: 16,
                            height: 9
                        },
                    ]
                }
            })
        }
    }

    const blog = {
        label: t("blog.label"),
        title: t("blog.title"),
        description: t("blog.description", {name: person.name})
        // Create new blog posts by adding a new .mdx file to app/blog/posts
        // All posts will be listed on the /blog route
    }

    const work = {
        label: t("work.label"),
        title: t("work.title"),
        description: t("work.description", {name: person.name})
        // Create new project pages by adding a new .mdx file to app/blog/posts
        // All projects will be listed on the /home and /work routes
    }

    const gallery = {
        label: t("gallery.label"),
        title: t("gallery.title"),
        description: t("gallery.description", {name: person.name}),
        // Images from https://pexels.com
        images: [
            {
                src: '/images/gallery/img-01.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-02.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/img-03.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            { 
                src: '/images/gallery/img-04.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-05.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-06.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-07.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-08.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-09.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-10.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/img-11.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-12.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-13.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/img-14.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
        ]
    }
    return {
        person,
        social,
        newsletter,
        home,
        about,
        blog,
        work,
        gallery
    }
};

export { createI18nContent };