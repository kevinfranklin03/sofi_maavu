import React, { useState, useEffect, useRef } from 'react';
import '../styles/contactus.css';
import Navbar from '../components/Navbar';
import mandala from '../assets/mandela.png';
import penImage from '../assets/pen.svg';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });
  const [isTyping, setIsTyping] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'name', 'message', 'contact'

  const nameRef = useRef(null);
  const messageRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧠 Get the position of the current anchor element
  useEffect(() => {
    let targetRef;
    switch (activeField) {
      case 'name':
        targetRef = nameRef;
        break;
      case 'message':
        targetRef = messageRef;
        break;
      case 'contact':
        targetRef = contactRef;
        break;
      case 'footer':
        targetRef = footerRef;
        break;
      default:
        return;
    }

    if (!targetRef?.current) return;

    const rect = targetRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    setCursorPos({
      x: rect.left + scrollX - 5,
      y: rect.top + scrollY - 15 // shift slightly up
    });
  }, [formData, activeField]);

  

  return (
    <div className="contact-page">
      <Navbar />
      <div className="rotating-mandala-background">
        <img src={mandala} alt="Mandala Background" />
      </div>

      {/* Pen */}
      {isTyping && (
        <div
          className="writing-pen"
          style={{ top: `${cursorPos.y}px`, left: `${cursorPos.x}px` }}
        >
          <img src={penImage} alt="Pen" className="typing" />
        </div>
      )}

      <div className="contact-split-container">
        {/* Left Letter */}
        <div className="writing-paper">
          <div className="vintage-letter">
            <div className="letter-header">
              <p>
                <strong>From,</strong>{' '}
                <span>{formData.name}</span>
                <span ref={nameRef} className="pen-anchor">|</span>
              </p>
            </div>
            <div className="letter-body">
              <p className="letter-dear"><strong>Dear Amma Nana,</strong></p>
              <p>
                <span>{formData.message}</span>
                <span ref={messageRef} className="pen-anchor">|</span>
              </p>
              <p>
                <strong>My contact info:</strong>{' '}
                <span>{formData.contact}</span>
                <span ref={contactRef} className="pen-anchor">|</span>
              </p>
            </div>
            <div className="letter-footer">
              <p><strong>Best regards,</strong></p>
              <p>
                <span>{formData.name}</span>
                <span ref={footerRef} className="pen-anchor">|</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <form className="contact-form" onChange={handleInputChange}>
          <h3>Send Us a Message</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            maxLength={30}
            required
            onFocus={() => {
              setActiveField('name');
              setIsTyping(true);
            }}
            onBlur={() => setIsTyping(false)}
          />
          <input
            type="text"
            name="contact"
            placeholder="Your Contact Number"
            maxLength={30}
            required
            onFocus={() => {
              setActiveField('contact');
              setIsTyping(true);
            }}
            onBlur={() => setIsTyping(false)}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="6"
            maxLength={300}
            required
            onFocus={() => {
              setActiveField('message');
              setIsTyping(true);
            }}
            onBlur={() => setIsTyping(false)}
          ></textarea>
          <button type="submit">Send</button>

            <div className="below-form-details">
    <p><strong>Phone:</strong> +91 9876543210</p>
    <p><strong>Email:</strong> ammananafoodschennai@gmail.com</p>
    <p><strong>GSTIN:</strong> 33NDVPS4644R1Z</p>
  </div>
        </form>
      </div>
    </div>
  );
};


export default ContactPage;
