import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out AaronOS',
      features: [
        '5 Lucy research queries per month',
        '1 eBook generation',
        'Basic templates',
        'Community support',
        'Email reports',
      ],
      limitations: [
        'Limited to basic features',
        'No priority support',
      ],
      cta: 'Start Free',
      ctaLink: '/signup',
      highlighted: false,
    },
    {
      name: 'Lucy Pro',
      price: '$49',
      period: 'per month',
      description: 'For teams serious about market intelligence',
      features: [
        'Unlimited Lucy research queries',
        'Advanced competitor analysis',
        'Real-time market monitoring',
        'Custom report templates',
        'Priority support',
        'API access',
        'Team collaboration (up to 5 users)',
        'Export to all formats',
      ],
      limitations: [],
      cta: 'Subscribe to Lucy Pro',
      ctaLink: '/signup?plan=lucy-pro',
      highlighted: true,
    },
    {
      name: 'eBook Pro',
      price: '$39',
      period: 'per month',
      description: 'For content creators and publishers',
      features: [
        'Unlimited eBook projects',
        'Advanced AI content generation',
        'Professional templates library',
        'Multi-format export (PDF, EPUB, MOBI)',
        'Custom branding',
        'Priority support',
        'Collaboration tools',
        'Commercial license',
      ],
      limitations: [],
      cta: 'Subscribe to eBook Pro',
      ctaLink: '/signup?plan=ebook-pro',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For organizations with advanced needs',
      features: [
        'Everything in Lucy Pro + eBook Pro',
        'Unlimited team members',
        'Custom AI model training',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option',
        'Advanced security features',
        'Custom integrations',
        'White-label options',
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlighted: false,
    },
  ]

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          AaronOS
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/lucy">Lucy</Link>
          <Link to="/ebook-machine">eBook Machine</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/signin" className="btn btn-secondary">
            Sign In
          </Link>
        </nav>
      </header>

      <main className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
          <h1>Choose Your Plan</h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
            Start free, upgrade when you need more power
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="card"
              style={{
                position: 'relative',
                border: plan.highlighted ? '2px solid #14b8a6' : '1px solid rgba(148, 163, 184, 0.2)',
                background: plan.highlighted
                  ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{plan.name}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#14b8a6', marginBottom: '0.25rem' }}>
                  {plan.price}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{plan.period}</div>
                <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>{plan.description}</p>
              </div>

              <ul style={{ marginBottom: '2rem', paddingLeft: '0', listStyle: 'none' }}>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      padding: '0.5rem 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <span style={{ color: '#14b8a6', flexShrink: 0 }}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', textAlign: 'center' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="card" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem', textAlign: 'left' }}>
            <div>
              <h3 style={{ color: '#14b8a6', marginBottom: '0.5rem' }}>Can I switch plans later?</h3>
              <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.</p>
            </div>
            <div>
              <h3 style={{ color: '#14b8a6', marginBottom: '0.5rem' }}>What payment methods do you accept?</h3>
              <p>We accept all major credit cards (Visa, MasterCard, American Express) and offer invoicing for Enterprise customers.</p>
            </div>
            <div>
              <h3 style={{ color: '#14b8a6', marginBottom: '0.5rem' }}>Is there a commitment period?</h3>
              <p>No, all plans are month-to-month. You can cancel anytime without penalty.</p>
            </div>
            <div>
              <h3 style={{ color: '#14b8a6', marginBottom: '0.5rem' }}>Do you offer refunds?</h3>
              <p>Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact support for a full refund.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '12px' }}>
          <h2>Ready to Get Started?</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
            Join thousands of businesses using AaronOS to accelerate their growth
          </p>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Start Your Free Trial
          </Link>
        </div>
      </main>
    </>
  )
}
