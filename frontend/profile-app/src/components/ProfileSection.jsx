import React from 'react'

/**
 * Reusable wrapper component that takes props and uses the `children` prop.
 * Layout classes strictly use Tailwind's 4px scale (p-6 = 24px, mb-6 = 24px, gap-3 = 12px).
 * Audited: {children} is passed directly as an expression, never quoted as a string.
 */
export default function ProfileSection({ title, description, icon: Icon, badge, children }) {
  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
        {badge && (
          <span className="self-start sm:self-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-4 text-gray-700">
        {children}
      </div>
    </section>
  )
}
