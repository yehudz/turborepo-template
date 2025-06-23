// All interface definitions

import { StatusE, UserRoleE, ThemeModeE, ToastTypeE, ModalSizeE, SortOrderE } from './enums'

export interface BaseEntityI {
  id: string | number
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponseI<T = unknown> {
  data: T
  message: string
  status: StatusE
}

export interface ApiErrorI {
  message: string
  code: string
  statusCode: number
}

export interface PaginationParamsI {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: SortOrderE
}

export interface PaginatedResponseI<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserI extends BaseEntityI {
  email: string
  name: string
  avatar?: string
  role: UserRoleE
  isActive: boolean
}

export interface UserPreferencesI {
  theme: ThemeModeE
  language: string
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
}

export interface CreateUserRequestI {
  email: string
  name: string
  password: string
}

export interface UpdateUserRequestI {
  name?: string
  avatar?: string
  preferences?: Partial<UserPreferencesI>
}

export interface AuthSessionI {
  user: UserI
  token: string
  expiresAt: Date
}

export interface ToastMessageI {
  id: string
  type: ToastTypeE
  title: string
  description?: string
  duration?: number
}

export interface ModalPropsI {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: ModalSizeE
}

export interface FormFieldPropsI {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export interface NavigationItemI {
  label: string
  href: string
  icon?: string
  badge?: string | number
  children?: NavigationItemI[]
}

export interface BreadcrumbItemI {
  label: string
  href?: string
  isCurrentPage?: boolean
}