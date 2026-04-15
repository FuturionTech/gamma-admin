export function useGraphQLErrorParser() {
    function parse(error: any): string {
        if (!error) return 'An unknown error occurred.';

        const messages: string[] = [];

        if (Array.isArray(error.graphQLErrors)) {
            error.graphQLErrors.forEach((err: any) => {
                const debugMsg = err.extensions?.debugMessage || '';
                const userMsg = convertDebugMessageToUserMessage(debugMsg);
                messages.push(userMsg || err.message || 'Unknown GraphQL error.');
            });
        }

        if (error.networkError) {
            messages.push(`Network error: ${error.networkError.message}`);
        }

        if (messages.length === 0 && error.message) {
            messages.push(error.message);
        }

        return messages.join('\n');
    }

    function convertDebugMessageToUserMessage(debugMsg: string): string | null {
        const match = debugMsg.match(/Cannot return null for non-nullable field "([^"]+)\.([^"]+)"/);
        if (match) {
            const field = match[2];
            const label = fieldToLabel(field);
            return `The "${label}" field cannot be empty.`;
        }
        return null;
    }

    function fieldToLabel(field: string): string {
        const labels: Record<string, string> = {
            author_name: 'Author name',
            author_position: 'Position',
            author_company: 'Company',
            content: 'Content',
            rating: 'Rating',
            image_path: 'Image',
        };
        return labels[field] || field;
    }

    return { parse };
}
