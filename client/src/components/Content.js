import splitContent from '../util/splitContent';

export default function Content(props) {
    const { className, content, limit } = props;

    const parts = splitContent(content);
    const partsWithinLimit = [];
    let characters = 0;
    let key = 0;

    for (let i = 0; i < parts.length; i++) {
        partsWithinLimit.push([]);

        for (let j = 0; j < parts[i].length; j++) {
            const match = parts[i][j].match(/\[(.+?)\]\((https?:\/\/.*?)\)/);

            if (match) {
                if (limit && characters + match[1].length >= limit) {
                    partsWithinLimit[i].push(<a
                        key={key++}
                        onClick={(event) => { event.stopPropagation() }}
                        href={match[2]}
                        target='_blank'
                        rel='noopener noreferrer'>{`${match[1].slice(0, limit - characters)}...`}</a>);
                    characters += limit - characters;
                    break;
                }

                partsWithinLimit[i].push(<a
                    key={key++}
                    onClick={(event) => { event.stopPropagation() }}
                    href={match[2]}
                    target='_blank'
                    rel='noopener noreferrer'>{match[1]}</a>);

                characters += match[1].length;
            } else {
                if (limit && characters + parts[i][j].length >= limit) {
                    partsWithinLimit[i].push(`${parts[i][j].slice(0, limit - characters)}...`);
                    characters += limit - characters;
                    break;
                }

                partsWithinLimit[i].push(parts[i][j]);

                characters += parts[i][j].length;
            }
        }

        if (limit && characters >= limit) {
            break;
        }
    }

    return (
        <div className={className}>
            {partsWithinLimit.map((part, index) => <p key={index}>{part}</p>)}
        </div>
    )
}
