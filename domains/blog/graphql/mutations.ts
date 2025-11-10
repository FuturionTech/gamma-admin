import gql from 'graphql-tag'

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
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

export const UPDATE_BLOG_POST = gql`
  mutation UpdateBlogPost($id: ID!, $input: UpdateBlogPostInput!) {
    updateBlogPost(id: $id, input: $input) {
      id
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

export const DELETE_BLOG_POST = gql`
  mutation DeleteBlogPost($id: ID!) {
    deleteBlogPost(id: $id) {
      id
      success
      message
    }
  }
`
