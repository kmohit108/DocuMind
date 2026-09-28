import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Database,
  Sparkles,
  UserCheck,
  FileText,
} from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | DocuMind',
  description:
    'Learn how DocuMind collects, uses, stores, and protects your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <span className="font-bold text-lg text-white tracking-tight">
              DocuMind
            </span>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
              AI
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

        </div>
      </header>


      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* Page Heading */}
        <div className="mb-12">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-semibold mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy & Security
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-2xl">
            This Privacy Policy explains how DocuMind collects, uses, stores,
            and protects information when you use our AI-powered document
            management application.
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Last updated: September 28, 2026
          </p>

        </div>


        {/* Quick Summary */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <UserCheck className="w-5 h-5 text-indigo-400 mb-3" />

            <h3 className="text-sm font-semibold text-white">
              Your Account
            </h3>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              We use account information to authenticate you and provide access
              to your workspace.
            </p>
          </div>


          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <FileText className="w-5 h-5 text-purple-400 mb-3" />

            <h3 className="text-sm font-semibold text-white">
              Your Documents
            </h3>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Documents you upload are stored so you can manage and use them
              within DocuMind.
            </p>
          </div>


          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <Lock className="w-5 h-5 text-emerald-400 mb-3" />

            <h3 className="text-sm font-semibold text-white">
              Data Protection
            </h3>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              We use authentication, access controls, and database security
              policies to help protect your information.
            </p>
          </div>

        </section>


        {/* 1. Information We Collect */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            1. Information We Collect
          </h2>

          <p className="text-sm text-slate-400 leading-7 mb-4">
            When you use DocuMind, we may collect information that you provide
            directly to us or information generated through your use of the
            application.
          </p>

          <ul className="space-y-3 text-sm text-slate-400">

            <li className="flex gap-3">
              <span className="text-indigo-400">•</span>
              <span>
                <strong className="text-slate-300">
                  Account information:
                </strong>{' '}
                name, email address, authentication information, and profile
                information.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-indigo-400">•</span>
              <span>
                <strong className="text-slate-300">
                  Google account information:
                </strong>{' '}
                if you choose Google Sign In, we may receive the account
                information provided by Google for authentication.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-indigo-400">•</span>
              <span>
                <strong className="text-slate-300">
                  Uploaded content:
                </strong>{' '}
                documents and related information that you upload or create
                within your DocuMind workspace.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-indigo-400">•</span>
              <span>
                <strong className="text-slate-300">
                  AI interactions:
                </strong>{' '}
                prompts, questions, and document-related information submitted
                to AI features in order to provide requested responses.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="text-indigo-400">•</span>
              <span>
                <strong className="text-slate-300">
                  Usage information:
                </strong>{' '}
                information needed to operate, maintain, debug, and improve
                the application.
              </span>
            </li>

          </ul>

        </section>


        {/* 2. How We Use Information */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            2. How We Use Your Information
          </h2>

          <p className="text-sm text-slate-400 leading-7 mb-4">
            We use information collected through DocuMind for purposes such as:
          </p>

          <ul className="space-y-3 text-sm text-slate-400">

            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Providing and maintaining your DocuMind account.
            </li>

            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Authenticating users and protecting account access.
            </li>

            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Storing and managing documents uploaded by users.
            </li>

            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Providing AI-powered summaries and document question-answering
              features.
            </li>

            <li className="flex gap-3">
              <span className="text-purple-400">•</span>
              Maintaining application functionality, security, and reliability.
            </li>

          </ul>

        </section>


        {/* 3. Documents */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            3. Your Documents and Content
          </h2>

          <p className="text-sm text-slate-400 leading-7">
            Documents uploaded to DocuMind are associated with your account so
            that you can access and manage them through your workspace. Your
            document data is intended to be accessible only to authorized users
            according to the application's access-control rules.
          </p>

          <p className="text-sm text-slate-400 leading-7 mt-4">
            Please avoid uploading highly sensitive information unless you have
            determined that DocuMind is appropriate for that type of content.
            You are responsible for ensuring that you have the necessary rights
            to upload and process documents that you provide to the application.
          </p>

        </section>


        {/* 4. AI Processing */}
        <section className="mb-10">

          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />

            <h2 className="text-xl font-bold text-white">
              4. AI Features
            </h2>
          </div>

          <p className="text-sm text-slate-400 leading-7">
            DocuMind uses AI services to provide features such as document
            summaries and question answering. Information necessary to generate
            an AI response may be sent to the configured AI service.
          </p>

          <p className="text-sm text-slate-400 leading-7 mt-4">
            AI-generated responses may contain errors or incomplete
            information. You should review important information independently
            before relying on an AI-generated response.
          </p>

        </section>


        {/* 5. Service Providers */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            5. Third-Party Services
          </h2>

          <p className="text-sm text-slate-400 leading-7 mb-4">
            DocuMind relies on third-party infrastructure and services to
            provide certain functionality.
          </p>

          <div className="space-y-4">

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70">

              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-emerald-400" />

                <h3 className="text-sm font-semibold text-white">
                  Supabase
                </h3>
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Used for authentication, database functionality, and document
                storage.
              </p>

            </div>


            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70">

              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-indigo-400" />

                <h3 className="text-sm font-semibold text-white">
                  Google Gemini
                </h3>
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Used to provide AI-powered document analysis and responses.
              </p>

            </div>

          </div>

        </section>


        {/* 6. Cookies and Local Storage */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            6. Cookies and Local Storage
          </h2>

          <p className="text-sm text-slate-400 leading-7">
            DocuMind may use browser storage and authentication cookies to
            maintain sessions, remember application preferences, and provide a
            consistent user experience.
          </p>

          <p className="text-sm text-slate-400 leading-7 mt-4">
            You can manage browser storage and cookies through your browser
            settings. Disabling certain storage mechanisms may affect parts of
            the application.
          </p>

        </section>


        {/* 7. Security */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            7. Data Security
          </h2>

          <p className="text-sm text-slate-400 leading-7">
            We take reasonable technical and organizational measures designed
            to protect information against unauthorized access, alteration,
            disclosure, or destruction. DocuMind uses authenticated access
            controls and database security policies to help isolate user data.
          </p>

          <p className="text-sm text-slate-400 leading-7 mt-4">
            However, no internet-based service can guarantee absolute security.
            You should use a strong password and keep your account credentials
            confidential.
          </p>

        </section>


        {/* 8. Data Retention */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            8. Data Retention
          </h2>

          <p className="text-sm text-slate-400 leading-7">
            We retain account and application data for as long as reasonably
            necessary to provide the service, maintain security, comply with
            applicable obligations, and support legitimate operational needs.
          </p>

          <p className="text-sm text-slate-400 leading-7 mt-4">
            Specific retention periods may vary depending on the type of
            information and the purpose for which it is processed.
          </p>

        </section>


        {/* 9. Your Rights */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            9. Your Choices and Rights
          </h2>

          <p className="text-sm text-slate-400 leading-7 mb-4">
            Depending on applicable law, you may have rights regarding your
            personal information, including the ability to:
          </p>

          <ul className="space-y-3 text-sm text-slate-400">

            <li className="flex gap-3">
              <span className="text-sky-400">•</span>
              Request access to personal information associated with your
              account.
            </li>

            <li className="flex gap-3">
              <span className="text-sky-400">•</span>
              Request correction of inaccurate information.
            </li>

            <li className="flex gap-3">
              <span className="text-sky-400">•</span>
              Request deletion of your account or personal information, subject
              to applicable requirements.
            </li>

            <li className="flex gap-3">
              <span className="text-sky-400">•</span>
              Ask questions about how your information is processed.
            </li>

          </ul>

        </section>


        {/* 10. Children's Privacy */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            10. Children's Privacy
          </h2>

          <p className="text-sm text-slate-400 leading-7">
            DocuMind is intended for general users and is not specifically
            designed for children. We do not knowingly request or collect
            personal information from children in violation of applicable law.
          </p>

        </section>


        {/* 11. Changes */}
        <section className="mb-10">

          <h2 className="text-xl font-bold text-white mb-4">
            11. Changes to This Privacy Policy
          </h2>

          <p className="text-sm text-slate-400 leading-7">
            We may update this Privacy Policy when our application,
            infrastructure, practices, or legal requirements change. When
            changes are made, the updated version will be posted on this page
            with a revised “Last updated” date.
          </p>

        </section>


        {/* 12. Contact */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border border-indigo-800/30">

          <h2 className="text-xl font-bold text-white mb-3">
            12. Contact Us
          </h2>

          <p className="text-sm text-slate-400 leading-7">
            If you have questions about this Privacy Policy or how your
            information is handled, please contact us.
          </p>

          <p className="text-sm text-indigo-400 font-semibold mt-4">
            Email: kmohit6221@example.com
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Replace the email address above with your official contact email
            before deploying the website publicly.
          </p>

        </section>

      </main>


      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-[11px] text-slate-600">
            © 2026 DocuMind. All rights reserved.
          </p>

          <div className="flex items-center gap-4">

            <Link
              href="/"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Home
            </Link>

            <Link
              href="/login"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Sign In
            </Link>

            <span className="text-[11px] text-indigo-400 font-medium">
              Privacy Policy
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}