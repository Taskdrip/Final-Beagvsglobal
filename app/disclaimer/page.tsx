export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Disclaimer</h1>
      
      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">General Information</h2>
          <p className="leading-relaxed">
            The information provided by Beagvs is for general informational purposes only. All information on the platform is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Platform Use</h2>
          <p className="leading-relaxed">
            Beagvs provides a marketplace platform that connects buyers and sellers. We are not a party to any transaction between users and do not guarantee the quality, safety, or legality of items listed, the truth or accuracy of listings, or the ability of sellers to complete sales or of buyers to complete purchases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Transaction Responsibility</h2>
          <p className="leading-relaxed mb-4">
            Users are solely responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Verifying the identity and legitimacy of other users</li>
            <li>Ensuring items meet their expectations and requirements</li>
            <li>Complying with all applicable local, state, and federal laws</li>
            <li>Determining appropriate shipping methods and insurance</li>
            <li>Resolving disputes with other users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Pi Network Integration</h2>
          <p className="leading-relaxed">
            While we integrate with Pi Network for payment processing, we are an independent platform and are not affiliated with, endorsed by, or sponsored by Pi Network. Pi Network payment availability and functionality are subject to Pi Network's terms and conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Escrow System</h2>
          <p className="leading-relaxed">
            Our escrow system is designed to protect transactions, but it is not insurance. We hold payments in escrow and release them according to our terms of service. In case of disputes, we make decisions based on available evidence, but we cannot guarantee outcomes favorable to any particular party.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Shipping and Delivery</h2>
          <p className="leading-relaxed">
            Beagvs facilitates shipping through third-party carriers but does not control delivery times, methods, or outcomes. We are not responsible for delayed, lost, damaged, or stolen shipments. Users should purchase appropriate shipping insurance for valuable items.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">No Warranties</h2>
          <p className="leading-relaxed">
            The platform is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, secure, or error-free, or that defects will be corrected.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
          <p className="leading-relaxed">
            Under no circumstances shall Beagvs be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from your use of the platform, including but not limited to loss of profits, data, or other intangibles, even if we have been advised of the possibility of such damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">External Links</h2>
          <p className="leading-relaxed">
            Our platform may contain links to external websites. We have no control over the content and practices of these sites and cannot accept responsibility for their respective privacy policies or content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Cryptocurrency Risks</h2>
          <p className="leading-relaxed">
            Trading and transacting with cryptocurrency, including Pi Network tokens, involves significant risks. Cryptocurrency values can be volatile, and users should be aware of the risks associated with digital currency transactions. Beagvs is not responsible for cryptocurrency value fluctuations or blockchain network issues.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">No Professional Advice</h2>
          <p className="leading-relaxed">
            Information provided on Beagvs should not be construed as legal, financial, or professional advice. Users should consult with appropriate professionals before making significant purchase or sale decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">User Content</h2>
          <p className="leading-relaxed">
            Users are responsible for their own content, including listings, descriptions, images, and communications. Beagvs does not endorse, verify, or guarantee the accuracy of user-generated content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Disclaimer</h2>
          <p className="leading-relaxed">
            We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
          <p className="leading-relaxed">
            If you have questions about this disclaimer, please contact us at legal@beagvs.com.
          </p>
        </section>

        <div className="pt-8 border-t">
          <p className="text-sm">Last Updated: January 2024</p>
        </div>
      </div>
    </div>
  );
}
