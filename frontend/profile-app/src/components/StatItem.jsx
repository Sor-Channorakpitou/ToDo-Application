import React from 'react'

/**
 * Reusable props-driven component rendering different metrics per instance.
 * Strict 4px scale classes: p-4 = 16px, gap-3 = 12px, h-10/w-10 = 40px, rounded-lg = 8px.
 * Visual hierarchy: text-gray-900 (primary value), text-gray-700 (label), text-gray-500 (help text).
 */
export default function StatItem({ icon: Icon, label, value, subtext, trend }) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-300 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {label}
        </span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-50 text-gray-500 transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-600">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-gray-500">
          {subtext}
        </p>
      )}
    </div>
  )
}
