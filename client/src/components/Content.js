import split_content from '../util/split_content';

export default function Content(props) {
    const { className, content, limit } = props;

    const parts = split_content(content);
    const parts_within_limit = [];
    let characters = 0;
    let key = 0;

    for (let i = 0; i < parts.length; i++) {
        parts_within_limit.push([]);

        for (let j = 0; j < parts[i].length; j++) {
            const match = parts[i][j].match(/\[(.+?)\]\((https?:\/\/.*?)\)/);

            if (match) {
                if (limit && characters + match[1].length >= limit) {
                    parts_within_limit[i].push(<a
                        key={key++}
                        onClick={(event) => { event.stopPropagation() }}
                        href={match[2]}
                        target='_blank'
                        rel='noopener noreferrer'>{`${match[1].slice(0, limit - characters)}...`}</a>);
                    characters += limit - characters;
                    break;
                }

                parts_within_limit[i].push(<a
                    key={key++}
                    onClick={(event) => { event.stopPropagation() }}
                    href={match[2]}
                    target='_blank'
                    rel='noopener noreferrer'>{match[1]}</a>);

                characters += match[1].length;
            } else {
                if (limit && characters + parts[i][j].length >= limit) {
                    parts_within_limit[i].push(`${parts[i][j].slice(0, limit - characters)}...`);
                    characters += limit - characters;
                    break;
                }

                parts_within_limit[i].push(parts[i][j]);

                characters += parts[i][j].length;
            }
        }

        if (limit && characters >= limit) {
            break;
        }
    }

    return (
        <div className={className}>
            {parts_within_limit.map((part, index) => <p key={index}>{part}</p>)}
        </div>
    )
}
