export function hello(): string {
    return 'hello world!';
}

export async function get() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return await response.json();
}
