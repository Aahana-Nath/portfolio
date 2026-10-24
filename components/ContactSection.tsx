'use client'

import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import { useState } from 'react'

const CONTACT_OPTIONS = [
  { icon: 'mail', title: 'Write to me', subtitle: 'aahana.nath@gmail.com', href: 'mailto:aahana.nath@gmail.com' },
  { icon: 'in', title: 'LinkedIn', subtitle: "Let’s connect", href: 'https://www.linkedin.com/in/aahana-nath-31189b21a', external: true },
  { icon: 'calendar', title: 'Schedule a call', subtitle: 'Find a time' },
  { icon: 'file', title: 'Resume', subtitle: 'View my resume', href: 'https://go.fliplink.me/view/CAD2CECE-B9E4-4830-83AA-A64A54AF4A84', external: true },
] as const

function ContactIcon({ name }: { name: (typeof CONTACT_OPTIONS)[number]['icon'] }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none' } as const
  if (name === 'mail') {
    return <svg {...common}><path d="M3.5 6.5h17v11h-17z" stroke="currentColor" strokeWidth="2" /><path d="m4.5 7.5 7.5 6 7.5-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
  }
  if (name === 'in') {
    return <svg {...common}><path d="M7 9.5V18M7 6.2v.1M11 18v-8.5h3.2a3.8 3.8 0 0 1 3.8 3.8V18M11 13.2c0-2.1 1.4-3.7 3.4-3.7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
  }
  if (name === 'calendar') {
    return <svg {...common}><rect x="4" y="5.5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  }
  return <svg {...common}><path d="M6 3.5h8l4 4V20H6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M14 3.5v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

function ArrowUpRight() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Star() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 1 2.2 8.8L23 12l-8.8 2.2L12 23l-2.2-8.8L1 12l8.8-2.2L12 1Z" fill="#7c3aed" /></svg>
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    message: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.title.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all fields before sending your message.')
      return
    }

    if (!emailPattern.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setErrorMessage('Email service is not configured yet. Please set EmailJS environment variables.')
      return
    }

    try {
      setIsSubmitting(true)
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          title: formData.title.trim(),
          message: formData.message.trim(),
        },
        { publicKey },
      )

      setSuccessMessage('Message sent successfully. I will get back to you soon!')
      setFormData({ name: '', email: '', title: '', message: '' })
    } catch {
      setErrorMessage('Failed to send message. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-[#fbfaf8] px-6 pb-36 pt-16 md:px-10 md:pb-44 md:pt-24">
      <div aria-hidden className="pointer-events-none absolute right-[9%] top-8"><Star /></div>

      <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="mb-8 text-[13px] font-semibold tracking-[0.16em] text-violet-700 uppercase">
            14 — Contact
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.05 }} className="mb-7 font-serif text-[3.6rem] font-medium leading-[0.98] text-[#111126] md:text-[5.2rem]">
            Have a problem<br /><span className="italic text-violet-600">worth solving?</span>
          </motion.h2>
          <p className="mb-8 max-w-[620px] font-sans text-[18px] leading-relaxed text-[#77788f] md:text-[20px]">
            Hiring a PM, or building something with AI? Tell me the problem.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-3">
            {CONTACT_OPTIONS.map((option, index) => {
              const content = (
                <>
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100/80 text-violet-600"><ContactIcon name={option.icon} /></span>
                  <p className="font-serif text-[17px] font-semibold leading-snug text-[#17172d] md:text-[19px]">{option.title}</p>
                  <p className="mt-1 font-sans text-[13px] leading-snug text-[#77788f]">{option.subtitle}</p>
                  <span className="mt-4 inline-flex text-[#17172d]"><ArrowUpRight /></span>
                </>
              )
              const cardClassName = 'min-h-[176px] rounded-2xl border border-[#e3e1e9] bg-white/55 p-4 md:p-5'
              const animationProps = {
                initial: { opacity: 0, y: 14 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.4, delay: 0.08 + index * 0.06 },
                className: cardClassName,
              }

              return option.href ? (
                <motion.a
                  key={option.title}
                  {...animationProps}
                  href={option.href}
                  target={option.external ? '_blank' : undefined}
                  rel={option.external ? 'noreferrer' : undefined}
                  aria-label={`${option.title}: ${option.subtitle}`}
                >
                  {content}
                </motion.a>
              ) : (
                <motion.div key={option.title} {...animationProps}>
                  {content}
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.12 }} className="relative z-10 rounded-2xl border border-[#e5e1ec] bg-white/55 p-6 md:p-8">
          <h3 className="mb-2 font-serif text-[27px] font-semibold text-[#17172d] md:text-[30px]">Send a message</h3>
          <p className="mb-7 max-w-[440px] font-sans text-[15px] leading-relaxed text-[#77788f] md:text-[16px]">
            Have a question, opportunity or just want to say hi? I’ll get back to you as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="contact-name">Your name</label>
            <input id="contact-name" name="name" type="text" value={formData.name} onChange={handleInputChange} required placeholder="Your name" className="h-[50px] min-w-0 rounded-xl border border-[#e2e0e8] bg-white/50 px-4 font-sans text-[14px] text-[#17172d] outline-none placeholder:text-[#88899d] focus:border-violet-400" />
            <label className="sr-only" htmlFor="contact-email">Your email</label>
            <input id="contact-email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="Your email" className="h-[50px] min-w-0 rounded-xl border border-[#e2e0e8] bg-white/50 px-4 font-sans text-[14px] text-[#17172d] outline-none placeholder:text-[#88899d] focus:border-violet-400" />
            <label className="sr-only" htmlFor="contact-topic">What’s this about?</label>
            <select id="contact-topic" name="title" value={formData.title} onChange={handleInputChange} required className="h-[50px] min-w-0 appearance-none rounded-xl border border-[#e2e0e8] bg-white/50 px-4 font-sans text-[14px] text-[#77788f] outline-none focus:border-violet-400 sm:col-span-2">
              <option value="" disabled>What’s this about?</option>
              <option value="Opportunity">Opportunity</option>
              <option value="Product design">Product design</option>
              <option value="Just saying hi">Just saying hi</option>
            </select>
            <label className="sr-only" htmlFor="contact-message">Your message</label>
            <textarea id="contact-message" name="message" value={formData.message} onChange={handleInputChange} required placeholder="Your message..." className="h-32 min-w-0 resize-y rounded-xl border border-[#e2e0e8] bg-white/50 px-4 py-3 font-sans text-[14px] text-[#17172d] outline-none placeholder:text-[#88899d] focus:border-violet-400 sm:col-span-2" />
            {errorMessage && <p className="font-sans text-[13px] text-rose-600 sm:col-span-2">{errorMessage}</p>}
            {successMessage && <p className="font-sans text-[13px] text-emerald-700 sm:col-span-2">{successMessage}</p>}
            <button type="submit" disabled={isSubmitting} className="flex h-[54px] items-center justify-center gap-3 rounded-full bg-[#17152f] px-5 font-sans text-[14px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2">
              {isSubmitting ? 'Sending...' : 'Send message'} <span aria-hidden className="text-[20px] leading-none">→</span>
            </button>
          </form>
        </motion.div>
      </div>

      <div aria-hidden className="pointer-events-none absolute -bottom-[250px] left-[-15%] z-0 h-[380px] w-[145%] rotate-[-6deg] rounded-[50%] bg-[#17152f] md:-bottom-[280px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-2 right-[3%] z-10 hidden h-24 w-28 md:block">
        <div className="absolute left-1/2 top-1/2 h-8 w-28 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-[50%] border-2 border-violet-300/75" />
        <div className="absolute left-1/2 top-1/2 h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/40" style={{ background: 'radial-gradient(circle at 32% 28%, #d8c8ff 0%, #9d78f2 38%, #6034bb 78%, #39205f 100%)', boxShadow: 'inset -10px -8px 18px rgba(31,18,65,0.4), 0 5px 16px rgba(109,40,217,0.25)' }} />
      </div>
    </section>
  )
}
