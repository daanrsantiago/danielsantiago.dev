"use client";

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/routing';
import { routes, protectedRoutes } from '@/app/resources';
import { Flex, Spinner, Input, Button, Heading } from '@/once-ui/components';

interface RouteGuardProps {
    children: React.ReactNode;
}

const isRouteEnabled = (pathname: string | null) => {
    if (!pathname) return false;

    if (pathname in routes) {
        return routes[pathname as keyof typeof routes];
    }

    const dynamicRoutes = ['/blog', '/work'] as const;
    for (const route of dynamicRoutes) {
        if (pathname?.startsWith(route) && routes[route]) {
            return true;
        }
    }

    return false;
};

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const pathname = usePathname();
    // Both checks depend only on the path and the static config, so they run during
    // server rendering too: public pages ship their content in the initial HTML.
    const routeEnabled = isRouteEnabled(pathname);
    const isPasswordRequired = !!protectedRoutes[pathname as keyof typeof protectedRoutes];

    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(isPasswordRequired);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!isPasswordRequired) return;

        let cancelled = false;
        setIsAuthenticated(false);
        setIsCheckingAuth(true);

        fetch('/api/check-auth')
            .then((response) => {
                if (!cancelled) setIsAuthenticated(response.ok);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setIsCheckingAuth(false);
            });

        return () => {
            cancelled = true;
        };
    }, [pathname, isPasswordRequired]);

    const handlePasswordSubmit = async () => {
        const response = await fetch('/api/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
            setError(undefined);
        } else {
            setError('Incorrect password');
        }
    };

    if (!routeEnabled || (isPasswordRequired && isCheckingAuth)) {
        return (
        <Flex fillWidth paddingY="128" justifyContent="center">
            <Spinner />
        </Flex>
        );
    }

    if (isPasswordRequired && !isAuthenticated) {
        return (
        <Flex
            fillWidth paddingY="128" maxWidth={24} gap="24"
            justifyContent="center" direction="column" alignItems="center">
            <Heading align="center" wrap="balance">
                This page is password protected
            </Heading>
            <Input
                id="password"
                type="password"
                label="Enter password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(undefined);
                }}
                error={error}/>
            <Button onClick={handlePasswordSubmit} size="l">
                Submit
            </Button>
        </Flex>
        );
    }

    return <>{children}</>;
};

export { RouteGuard };
