export const PageHeader = ({
    title,
    subtitle
}: {
    title: string;
    subtitle: string;
}) => {
    return <>
        <h1 className="text-3xl font-semibold mb-2">{title}</h1>
        <p className="text-foreground-400 mb-6">
            {subtitle}
        </p>
    </>
}