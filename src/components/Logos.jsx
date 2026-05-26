import moodleImg     from '../assets/icon/Moodle_idD9n0MGMl_0.png'
import zoomImg       from '../assets/icon/Zoom-Logo.png'
import googleMeetImg from '../assets/icon/Google_Meet_text_logo_(2020).svg.png'
import teamsImg      from '../assets/icon/Microsoft-Teams-Emblem.png'
import scormImg      from '../assets/icon/scorm-logo-sized-800x451.webp'
import xapiImg       from '../assets/icon/xapi-logo-sized.webp'
import doceboImg     from '../assets/icon/idk_bIkuw8_1778333937916.svg'

const LOGOS = [
  { name: 'Moodle',          img: moodleImg,     h: 40 },
  { name: 'Zoom',            img: zoomImg,        h: 40 },
  { name: 'Google Meet',     img: googleMeetImg,  h: 40 },
  { name: 'Microsoft Teams', img: teamsImg,       h: 64 },
  { name: 'SCORM',           img: scormImg,       h: 60 },
  { name: 'xAPI',            img: xapiImg,        h: 60 },
  { name: 'Docebo',          img: doceboImg,      h: 40 },
]

export default function Logos() {
  return (
    <section style={{
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      padding: '80px 0',
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Fade sinistra */}
        <div style={{
          position: 'absolute', inset: '0 auto 0 0', width: 120, zIndex: 10,
          background: 'linear-gradient(to right, #ffffff 30%, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Fade destra */}
        <div style={{
          position: 'absolute', inset: '0 0 0 auto', width: 120, zIndex: 10,
          background: 'linear-gradient(to left, #ffffff 30%, transparent)',
          pointerEvents: 'none',
        }} />

        {/* Track — due copie identiche per loop seamless */}
        <div className="logos-track" style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          willChange: 'transform',
        }}>
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <img
              key={i}
              src={logo.img}
              alt={logo.name}
              style={{
                flexShrink: 0,
                height: logo.h,
                width: 'auto',
                maxWidth: 130,
                objectFit: 'contain',
                opacity: 0.65,
                margin: '0 68px',
                display: 'block',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .logos-track {
          animation: logosScroll 30s linear infinite;
        }
        @keyframes logosScroll {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </section>
  )
}
