import LegalLayout from "@/components/legal/legal-layout";

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="August 2, 2026"
      otherDocHref="/terms"
      otherDocLabel="Terms of Use"
    >
      <p>
        This Privacy Policy explains what information Wayfarer collects, how it is used, and the
        choices you have. By using Wayfarer, you agree to the practices described here.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Account information</h3>
      <p>
        When you sign in with Google, we receive your name, email address, and profile photo via
        Supabase Authentication. We do not receive your Google password.
      </p>
      <h3>Trip and preference data</h3>
      <p>
        We store the trips you generate and save, your favorite destinations, and your
        preferences (such as preferred currency and theme) in our database, linked to your
        account.
      </p>
      <h3>Usage and device information</h3>
      <p>
        We collect limited technical information — such as your IP address and request
        timestamps — to enforce rate limits, prevent abuse, and keep the Service reliable. A
        cookie is used to track whether you have used your one free trip generation before
        signing in.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To generate and display your personalized trip itineraries</li>
        <li>To let you save, view, and manage trips and favorite destinations</li>
        <li>To apply your saved currency and theme preferences</li>
        <li>To enforce rate limits and prevent abuse of the Service</li>
        <li>To improve the reliability and performance of the Service</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>3. Third Parties We Share Data With</h2>
      <p>
        To provide the Service, limited data is shared with the following processors as part of
        normal operation:
      </p>
      <ul>
        <li>
          <strong>Google / Supabase Authentication</strong> — to authenticate your sign-in
        </li>
        <li>
          <strong>Google Gemini</strong> — your destination, budget, and trip length are sent to
          generate your itinerary. Gemini does not receive your name or account information as
          part of this request.
        </li>
        <li>
          <strong>Supabase</strong> — hosts our database, which stores your account, trips,
          favorites, and preferences
        </li>
        <li>
          <strong>Unsplash</strong> — destination photo searches are sent to Unsplash's API; no
          personal account information is shared with Unsplash
        </li>
        <li>
          <strong>AeroDataBox (via RapidAPI)</strong> — airport codes derived from your trip
          destination and origin are sent to retrieve live flight information
        </li>
        <li>
          <strong>Vercel</strong> — hosts the application and may log request metadata (such as
          IP address) for operational purposes
        </li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        We use a small number of cookies: an authentication session cookie (set by Supabase) to
        keep you signed in, and a cookie that records whether you've already used your one free
        trip generation as a guest. We do not use advertising or third-party tracking cookies.
      </p>

      <h2>5. Data Retention and Deletion</h2>
      <p>
        Trips and favorites remain stored until you delete them from your dashboard. If you wish
        to delete your entire account and associated data, contact us at{" "}
        <a href="mailto:hello@loydie.dev">hello@loydie.dev</a> and we will process your request.
        Cached destination images (not tied to your account) may be retained to serve other
        users efficiently.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We rely on Supabase's Row Level Security to ensure that only you can access your own
        trips, favorites, and profile data. No method of transmission or storage is 100% secure,
        and we cannot guarantee absolute security.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        Wayfarer is not directed at children under 13, and we do not knowingly collect personal
        information from children under 13.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your
        personal data. You can manage most of your data directly from your dashboard, or contact
        us for requests we don't yet support through self-service tools.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected
        by updating the "Last updated" date above.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about this Privacy Policy can be sent to{" "}
        <a href="mailto:johnloyduy5@gmail.com">johnloyduy5@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}