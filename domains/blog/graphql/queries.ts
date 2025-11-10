import gql from 'graphql-tag'

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($application_id: ID!, $status: PostStatus, $limit: Int) {
    blogPosts(application_id: $application_id, status: $status, limit: $limit) {
      id
      application_id
      title
      slug
      excerpt
      content
      featured_image_url
      author_id
      category
      tags
      status
      published_at
      view_count
      created_at
      updated_at
      author {
        id
        first_name
        last_name
      }
    }
  }
`

export const GET_BLOG_POST_BY_SLUG = gql`
  query GetBlogPostBySlug($slug: String!) {
    blogPost(slug: $slug) {
      id
      application_id
      title
      slug
      excerpt
      content
      featured_image_url
      author_id
      category
      tags
      status
      published_at
      view_count
      created_at
      updated_at
      author {
        id
        first_name
        last_name
      }
    }
  }
`

export const GET_BLOG_POST_BY_ID = gql`
  query GetBlogPostById($id: ID!) {
    blogPost(id: $id) {
      id
      application_id
      title
      slug
      excerpt
      content
      featured_image_url
      author_id
      category
      tags
      status
      published_at
      view_count
      created_at
      updated_at
      author {
        id
        first_name
        last_name
      }
    }
  }
`
