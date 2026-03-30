import { render, screen } from '@testing-library/react'
import CatalogosPage from '../page'

describe('CatalogosPage', () => {
  it('renders the catalog hub title and subtitle', () => {
    render(<CatalogosPage />)
    expect(screen.getByText('Catálogos Maestros')).toBeInTheDocument()
    expect(screen.getByText('Administración de entidades base del sistema')).toBeInTheDocument()
  })

  it('renders all three module cards', () => {
    render(<CatalogosPage />)
    expect(screen.getByText('Usuarios y RBAC')).toBeInTheDocument()
    expect(screen.getByText('Roles y Permisos')).toBeInTheDocument()
    expect(screen.getByText('Alcance de Datos')).toBeInTheDocument()
  })

  it('renders cards as links to correct routes', () => {
    render(<CatalogosPage />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/users')
    expect(hrefs).toContain('/roles')
    expect(hrefs).toContain('/data-scopes')
  })
})
