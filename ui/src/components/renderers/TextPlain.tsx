interface TextPlainProps {
    text: string
}

export default function TextPlain({ text }: TextPlainProps) {
    if (!text) {
        return (
            <div className="hf wf fr as jc">
                <p>No text to display</p>
            </div>

        )
    }

    return (
        <div
            className="hf wf fr as js"
            style={{ whiteSpace: 'pre-wrap', overflowY: 'scroll' }}
        >
            <p>{text}</p>
        </div>
    )
}
