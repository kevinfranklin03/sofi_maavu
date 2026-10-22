import React, { useRef, useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [website, setWebsite] = useState('');
  const sending = useRef(false);
  const handleInputChange = event => {
    const { name, value } = event.target;
    event.target.setCustomValidity(value.trim() ? '' : 'Please enter a value, not only spaces.');
    setFormData(previous => ({ ...previous, [name]: value }));
    setStatus('idle'); setFeedback('');
  };
  const handleSubmit = async event => {
    event.preventDefault();
    if (sending.current || status === 'success' || !event.currentTarget.checkValidity() || Object.values(formData).some(value => !value.trim())) return;
    sending.current = true; setStatus('sending'); setFeedback('Sending your enquiry…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, website }), signal: controller.signal });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'We could not send your enquiry. Please try again shortly.');
      setStatus('success'); setFeedback(data.message || 'Thank you! Your enquiry has been sent.');
    } catch (error) {
      setStatus('error');
      setFeedback(error.name === 'AbortError' ? 'Delivery is taking longer than expected. We could not confirm it; please email us before retrying.' : error.message === 'Failed to fetch' ? 'Unable to connect. Check your connection and try again. Your message is still here.' : error.message);
    } finally { clearTimeout(timeout); sending.current = false; }
  };
  if (process.env.REACT_APP_STATIC_HOST === 'true') {
    return <div className="enquiry-form">
      <h3>A little hello goes a long way.</h3>
      <p>For batter availability, customised quantities, and bulk supply, get in touch with our team by email.</p>
      <a className="btn" href="mailto:ammananafoodschennai@gmail.com">Email our team <span aria-hidden="true">↗</span></a>
      <p className="privacy-note">Online form enquiries will be available once our email setup is complete.</p>
    </div>;
  }
  return <form className="enquiry-form" onSubmit={handleSubmit} aria-busy={status === 'sending'} aria-label="Send an enquiry">
    <h3>A little hello goes a long way.</h3>
    <p>Tell us what you need, and we’ll get back to you using your contact number.</p>
    <div className="form-trap" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></div>
    <fieldset disabled={status === 'sending'}>
      <legend className="sr-only">Enquiry details</legend>
      <div className="form-row">
        <div className="field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="How should we call you?" required maxLength={80} pattern=".*\S.*" value={formData.name} onChange={handleInputChange} /></div>
        <div className="field"><label htmlFor="contact-number">Contact number</label><input id="contact-number" type="tel" name="contact" autoComplete="tel" placeholder="Your phone number" required maxLength={30} pattern="(?=(?:\D*\d){7})[+0-9\(\) .\-]{7,30}" title="Enter a phone number with at least 7 digits and up to 30 characters." value={formData.contact} onChange={handleInputChange} /></div>
      </div>
      <div className="field"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" name="message" rows="5" required maxLength={2000} placeholder="The batter you love, the quantity you need, or anything you’d like to ask…" value={formData.message} onChange={handleInputChange} /></div>
      <div className="form-bottom"><span className="character-count">{formData.message.length} / 2,000</span><button className="btn" type="submit" disabled={status === 'sending' || status === 'success'}>{status === 'sending' ? 'Sending…' : status === 'success' ? 'Enquiry sent' : 'Send enquiry'} <span aria-hidden="true">↗</span></button></div>
    </fieldset>
    <div className={`form-feedback ${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{feedback}</div>
    <p className="privacy-note">Your details are only used to respond to your enquiry.</p>
  </form>;
}
