const message: string = "Hello world!";
const count: number = 42;
const isActive: boolean = true;
const items: string[] = ["one", "two", "three"]


function greet(message: string): string {
    return `Hello, ${message}!`;
}

interface User {
    id: number;
    name: string;
    email: string;
    age?: number;
}

const user: User = {
    id: 1,
    name: "John Doe",
    email: "johnn@example.com",
    asdf: 234
};

console.log(greet(user.name));

