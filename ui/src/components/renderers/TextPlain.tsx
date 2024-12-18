interface TextPlainProps {
    text: string
}

export default function TextPlain({ text }: TextPlainProps) {
    if (!text) {
        return (
            <div className="hf wf fr as js">
                <p>No text to display</p>
            </div>

        )
    }

    return (
        <div
            className="hf wf fr as js mono"
            style={{ whiteSpace: 'pre-wrap', overflowY: 'scroll' }}
        >
            <p>{text}</p>
        </div>
    )
}
