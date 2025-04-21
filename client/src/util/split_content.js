export default function split_content(content) {
    const parts = content.split(/\n/).filter(part => !part.match(/^\s*$/));
    for (let i = 0; i < parts.length; i++) {
        parts[i] = parts[i].split(/(\[.+?\]\(https?:\/\/.*?\))/);
    }
    return parts;
}
