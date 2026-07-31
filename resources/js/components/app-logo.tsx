import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-12 items-center justify-center text-sidebar-primary-foreground">
                <AppLogoIcon className="size-10 object-contain text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    RTCA AMS
                </span>
            </div>
        </>
    );
}
