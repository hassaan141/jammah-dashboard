import Link from 'next/link'

interface EventFormHeaderProps {
  title: string
  subtitle: string
  backHref: string
  backText: string
}

export default function EventFormHeader({ title, subtitle, backHref, backText }: EventFormHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>
        <Link
          href={backHref}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          {backText}
        </Link>
      </div>
    </div>
  )
}