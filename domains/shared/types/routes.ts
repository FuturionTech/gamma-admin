// domains/shared/types/routes.ts

export interface FeatureRoute {
    key: string;
    path?: string;
    title: string;
    icon?: string;
    adminOnly?: boolean; // Indicates if the route is admin-only
    children?: FeatureRoute[]; // Add this line
}

export const FEATURE_ROUTES: FeatureRoute[] = [
    {
        key: 'admin_hub', // Updated key
        path: '/applications',
        title: 'Applications', // Creative name for administrators
        icon: 'ki-duotone ki-applications-icon fs-3',
        adminOnly: true, // Only accessible by administrators
        children: [
            {
                key: 'applications',
                path: '/applications',
                title: 'Applications',
                icon: 'ki-duotone ki-applications-icon fs-3',
                adminOnly: true,
            },
            {
                key: 'tenants',
                path: '/tenants',
                title: 'Locataires',
                icon: 'ki-duotone ki-tenants-icon fs-3',
                adminOnly: true,
            },
        ],
    },
    {
        key: 'fonctionnalities',
        path: '/fonctionnalities',
        title: 'Fonctionnalités',
        icon: 'ki-duotone ki-fonctionnalities-icon fs-3',
        adminOnly: false,
    },
    {
        key: 'partners',
        path: '/partners',
        title: 'Partenaires',
        icon: 'ki-duotone ki-partners-icon fs-3',
        adminOnly: false,
    },
    {
        key: 'portfolio',
        path: '/portfolio',
        title: 'Portfolio',
        icon: 'ki-duotone ki-portfolio-icon fs-3',
        adminOnly: false,
    },
    {
        key: 'teams',
        path: '/teams',
        title: 'Équipes',
        icon: 'ki-duotone ki-teams-icon fs-3',
        adminOnly: false,
    },
    {
        key: 'testimonials',
        path: '/testimonials',
        title: 'Témoignages',
        icon: 'ki-duotone ki-testimonials-icon fs-3',
        adminOnly: false,
    },
    {
        key: 'services',
        path: '/services',
        title: 'Services',
        icon: 'ki-duotone ki-services-icon fs-3',
        adminOnly: false,
    },
    {
        key: 'clients',
        path: '/clients',
        title: 'Clients',
        icon: 'ki-duotone ki-clients-icon fs-3',
        adminOnly: false,
    },
    {
        key: 'coupons',
        path: '/coupons',
        title: 'Coupons',
        icon: 'ki-duotone ki-discount fs-3',
        adminOnly: true,
    },
    {
        key: 'portfolios',
        path: '/portfolios',
        title: 'Portfolios',
        icon: 'ki-duotone ki-portfolios-icon fs-3',
        adminOnly: false,
    },
    /*{
        key: 'products',
        path: '/products',
        title: 'Produits',
        icon: 'ki-duotone ki-products-icon fs-3',
        adminOnly: false,
    },*/
    {
        key: 'posts',
        title: 'Articles',
        icon: 'ki-duotone ki-posts-icon fs-3',
        adminOnly: false,
        children: [
            {
                key: 'posts_list',
                path: '/posts',
                title: 'Liste des Articles',
                icon: 'ki-duotone ki-posts-list-icon fs-3',
            },
            {
                key: 'posts_categories',
                path: '/post-categories',
                title: 'Catégories des articles',
                icon: 'ki-duotone ki-post-categories-icon fs-3',
            },
        ],
    },
    {
        key: 'sponsors',
        title: 'Sponsors',
        icon: 'ki-duotone ki-sponsors-icon fs-3',
        adminOnly: false,
        children: [
            {
                key: 'sponsors_list',
                path: '/sponsors',
                title: 'Liste des Sponsors',
                icon: 'ki-duotone ki-sponsors-icon fs-3',
            },
            {
                key: 'sponsors_tier',
                path: '/sponsor-tiers',
                title: 'Niveaux de Sponsors',
                icon: 'ki-duotone ki-sponsors-tier-icon fs-3',
            },
        ],
    },
    /*{
        key: 'events',
        path: '/events',
        title: 'Événements',
        icon: 'ki-duotone ki-events-icon fs-3',
        adminOnly: false,
    },*/
    // Add more features as needed
];
