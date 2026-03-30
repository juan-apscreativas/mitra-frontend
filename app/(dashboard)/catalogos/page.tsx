import Link from 'next/link'
import { Users, Shield, SlidersHorizontal } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { labels } from '@/lib/labels'

const catalogCards = [
  {
    href: '/users',
    icon: Users,
    title: labels.catalogsPage.cards.users.title,
    description: labels.catalogsPage.cards.users.description,
  },
  {
    href: '/roles',
    icon: Shield,
    title: labels.catalogsPage.cards.roles.title,
    description: labels.catalogsPage.cards.roles.description,
  },
  {
    href: '/data-scopes',
    icon: SlidersHorizontal,
    title: labels.catalogsPage.cards.dataScopes.title,
    description: labels.catalogsPage.cards.dataScopes.description,
  },
]

export default function CatalogosPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">{labels.catalogsPage.title}</h1>
        <p className="text-sm text-muted-foreground">{labels.catalogsPage.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalogCards.map((card) => (
          <Link key={card.href} href={card.href} className="group block">
            <Card className="h-full cursor-pointer ring-1 ring-foreground/10 transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 transition-colors duration-200 group-hover:bg-blue-100">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{card.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
