export default function Page({ params }: { params: { issue: string } }) {
    return (
        <div>
            Your help ticket <b>#{params.issue}</b>.
            ...
        </div>
    )
}