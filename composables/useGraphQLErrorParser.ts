// useGraphQLErrorParser.ts

export function useGraphQLErrorParser() {
    function parse(error: any): string {
        if (!error) return 'Une erreur inconnue est survenue.';

        const messages: string[] = [];

        // GraphQL errors
        if (Array.isArray(error.graphQLErrors)) {
            error.graphQLErrors.forEach((err: any) => {
                const debugMsg = err.extensions?.debugMessage || '';
                const userMsg = convertDebugMessageToUserMessage(debugMsg);
                messages.push(userMsg || err.message || 'Erreur GraphQL inconnue');
            });
        }

        // Network error
        if (error.networkError) {
            messages.push(`Erreur réseau : ${error.networkError.message}`);
        }

        // Generic error message
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
            return `Le champ "${label}" ne peut pas être vide.`;
        }
        return null;
    }

    function fieldToLabel(field: string): string {
        // Tu peux personnaliser ce mapping si tu veux des labels plus jolis
        const labels: Record<string, string> = {
            author_name: 'Nom de l’auteur',
            author_position: 'Poste',
            author_company: 'Entreprise',
            content: 'Contenu',
            rating: 'Note',
            image_path: 'Image',
        };
        return labels[field] || field;
    }

    return { parse };
}
