export interface ClientDomainConfig {
  domain: string
  slug: string
  businessName: string
}

const clientDomains: ClientDomainConfig[] = [
  {
    domain: 'dermeremodeling.com',
    slug: 'derme-family-remodeling',
    businessName: 'Derme Family Remodeling',
  },
  // Add future client domains here:
  // { domain: 'example.com', slug: 'example-business', businessName: 'Example Business' },
]

export function getClientDomainConfig(hostname: string): ClientDomainConfig | undefined {
  // Strip www. prefix and port number
  const bare = hostname.replace(/^www\./, '').split(':')[0]
  return clientDomains.find((c) => c.domain === bare)
}

export function isClientDomain(hostname: string): boolean {
  return !!getClientDomainConfig(hostname)
}
