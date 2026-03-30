import { labels } from '@/lib/labels'

export default function CatalogosPage() {
  return (
    <div>
      <h1>{labels.catalogsPage.title}</h1>
      <p>{labels.catalogsPage.subtitle}</p>
      <a href="/users">{labels.catalogsPage.cards.users.title}</a>
      <a href="/roles">{labels.catalogsPage.cards.roles.title}</a>
      <a href="/data-scopes">{labels.catalogsPage.cards.dataScopes.title}</a>
    </div>
  )
}
