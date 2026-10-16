"use client";

import { useRef, useState } from "react";
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

interface SwipeStart {
    x: number;
    y: number;
    time: number;
    axis: 'x' | 'y' | null;
}

// Finger travel (px) before deciding whether the gesture is a horizontal swipe or a page scroll.
const AXIS_LOCK_DISTANCE = 8;
// Drag distance (px) that switches project on release.
const SWIPE_DISTANCE = 50;
// A quick flick switches project with a shorter drag.
const FLICK_DISTANCE = 20;
const FLICK_DURATION_MS = 250;
// Dragging past the first/last project moves the track at this fraction of the finger.
const EDGE_RESISTANCE = 0.3;

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState<number | null>(null);
    const swipeStart = useRef<SwipeStart | null>(null);
    const suppressClick = useRef(false);
    const t = useTranslations();

    if (projects.length === 0) return null;

    const active = projects[activeIndex];
    const hasMultiple = projects.length > 1;
    const lastIndex = projects.length - 1;

    const goTo = (index: number) => {
        if (index >= 0 && index < projects.length) {
            setActiveIndex(index);
        }
    };

    const handleTouchStart = (event: React.TouchEvent) => {
        if (!hasMultiple || event.touches.length > 1) return;
        const touch = event.touches[0];
        swipeStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now(), axis: null };
        suppressClick.current = false;
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        const start = swipeStart.current;
        if (!start) return;
        const touch = event.touches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;

        if (start.axis === null) {
            if (Math.abs(dx) < AXIS_LOCK_DISTANCE && Math.abs(dy) < AXIS_LOCK_DISTANCE) return;
            start.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        }
        if (start.axis !== 'x') return;

        suppressClick.current = true;
        const pastEdge = (activeIndex === 0 && dx > 0) || (activeIndex === lastIndex && dx < 0);
        setDragOffset(pastEdge ? dx * EDGE_RESISTANCE : dx);
    };

    const handleTouchEnd = (event: React.TouchEvent) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        setDragOffset(null);
        if (!start || start.axis !== 'x') return;

        const dx = event.changedTouches[0].clientX - start.x;
        const isFlick = Date.now() - start.time < FLICK_DURATION_MS && Math.abs(dx) > FLICK_DISTANCE;
        if (Math.abs(dx) > SWIPE_DISTANCE || isFlick) {
            goTo(activeIndex + (dx < 0 ? 1 : -1));
        }
        // The click that some browsers fire after a drag must not open or select a project.
        setTimeout(() => { suppressClick.current = false; }, 400);
    };

    const handleTouchCancel = () => {
        swipeStart.current = null;
        setDragOffset(null);
    };

    const handleClickCapture = (event: React.MouseEvent) => {
        if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
        }
    };

    return (
        <Flex
            fillWidth
            direction="column"
            gap="m"
            className={styles.root}>
            <div
                className={styles.viewport}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
                onClickCapture={handleClickCapture}>
                <div
                    className={classNames(styles.track, dragOffset !== null && styles.dragging)}
                    style={{ transform: `translateX(calc(${-activeIndex} * (100% + var(--carousel-gap)) + ${dragOffset ?? 0}px))` }}>
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
