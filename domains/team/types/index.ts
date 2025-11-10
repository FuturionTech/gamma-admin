export interface SocialMediaPlatform {
  id: string
  name: string
  icon?: string | null
  base_url?: string | null
  created_at: string
  updated_at: string
}

export interface TeamSocialMediaLink {
  id: string
  team_id: string
  platform_id: string
  url: string
  created_at: string
  updated_at: string
  platform?: SocialMediaPlatform
}

export interface Team {
  id: string
  name: string
  role?: string | null
  email?: string | null
  contact?: string | null
  biography?: string | null
  profile_picture_url?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  socialMediaLinks?: TeamSocialMediaLink[]
}

export interface CreateTeamInput {
  name: string
  role?: string | null
  email?: string | null
  contact?: string | null
  biography?: string | null
  profile_picture_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateTeamInput {
  name?: string | null
  role?: string | null
  email?: string | null
  contact?: string | null
  biography?: string | null
  profile_picture_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface TeamFilterInput {
  search?: string | null
  is_active?: boolean | null
  role?: string | null
}

export interface TeamStatistics {
  total: number
  active: number
  inactive: number
  byRole: Record<string, number>
}

// GraphQL Response Types
export interface TeamsResponse {
  teams: Team[]
}

export interface TeamResponse {
  team: Team
}

export interface CreateTeamResponse {
  createTeam: Team
}

export interface UpdateTeamResponse {
  updateTeam: Team
}

export interface DeleteTeamResponse {
  deleteTeam: {
    id: string
    success: boolean
    message: string
  }
}

export interface SocialMediaPlatformsResponse {
  socialMediaPlatforms: SocialMediaPlatform[]
}

// UI State Types
export interface TeamFormData extends CreateTeamInput {
  profilePictureFile?: File | null
  socialLinks?: TeamSocialLinkInput[]
}

export interface TeamSocialLinkInput {
  platform_id: string
  url: string
  id?: string
}
