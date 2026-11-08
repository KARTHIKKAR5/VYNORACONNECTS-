import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Plus,
  X,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const TOTAL_STEPS = 6;
const STEP_LABELS = ['Account', 'Academic', 'Interests', 'Profile', 'Privacy', 'Review'];

const INTERESTS_OPTIONS = {
  Technology: [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Cybersecurity',
    'Cloud Computing',
    'Blockchain',
    'IoT',
    'Data Science',
    'DevOps',
    'Open Source',
  ],
  Creative: [
    'UI/UX Design',
    'Graphic Design',
    'Music',
    'Photography',
    'Writing & Content',
    'Video Editing',
    '3D Modeling',
  ],
  Career: [
    'Entrepreneurship',
    'Finance & Fintech',
    'Product Management',
    'Research & Academia',
    'Consulting',
    'Public Speaking',
  ],
  Community: [
    'Hackathons',
    'Competitive Programming',
    'College Clubs',
    'Mentorship',
    'Social Impact',
    'Event Organizing',
  ],
};

const POPULAR_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Go',
  'Rust',
  'Kotlin',
  'Swift',
  'SQL',
];

const POPULAR_TOOLS = [
  'React',
  'Node.js',
  'Docker',
  'Git',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Figma',
  'Next.js',
  'Express',
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Custom interest / skill inputs
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  // Form State
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    emailType: 'college',
    password: '',
    confirmPassword: '',

    college: '',
    university: '',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    academicYear: 'Third Year',
    graduationYear: 2026,
    city: '',
    state: '',

    interests: ['Web Development', 'AI & Machine Learning'],
    customInterests: [],

    bio: '',
    skills: ['React', 'JavaScript'],
    programmingLanguages: ['JavaScript', 'Python'],
    tools: ['React', 'Node.js', 'Git'],
    portfolioUrl: '',
    githubUrl: '',
    linkedinUrl: '',

    profileVisibility: 'students_only',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const toggleArrayItem = (key, item) => {
    setForm((prev) => {
      const exists = prev[key].includes(item);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((i) => i !== item) : [...prev[key], item],
      };
    });
  };

  const handleAddCustomInterest = (e) => {
    e?.preventDefault();
    const trimmed = customInterestInput.trim();
    if (trimmed && !form.customInterests.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        customInterests: [...prev.customInterests, trimmed],
      }));
      setCustomInterestInput('');
    }
  };

  const handleRemoveCustomInterest = (item) => {
    setForm((prev) => ({
      ...prev,
      customInterests: prev.customInterests.filter((i) => i !== item),
    }));
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !form.skills.includes(trimmed)) {
        setForm((prev) => ({
          ...prev,
          skills: [...prev.skills, trimmed],
        }));
        setSkillInput('');
      }
    }
  };

  const handleRemoveSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!form.firstName.trim()) return 'First name is required.';
      if (!form.email.trim()) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
      if (!form.password) return 'Password is required.';
      if (form.password.length < 8) return 'Password must be at least 8 characters long.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 2) {
      if (!form.college.trim()) return 'College name is required.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateCurrentStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await register({
        ...form,
        interests: [...form.interests, ...form.customInterests],
      });
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-register">
      <div className="register-container">
        {/* Header */}
        <div className="register-header">
          <Link to="/" className="auth-brand-logo">
            <Zap size={22} />
            <span>VYNORA CONNECT</span>
          </Link>
          <p className="register-header-sub">Create your verified student profile</p>
        </div>

        {/* Step Indicator */}
        <div className="register-stepper">
          {STEP_LABELS.map((label, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < step;
            const isCurrent = stepNum === step;
            return (
              <div
                key={label}
                className={`stepper-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="stepper-circle">
                  {isCompleted ? <Check size={12} /> : stepNum}
                </div>
                <span className="stepper-label">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="register-card">
          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="register-step-body">
              <h2 className="step-title">Account Information</h2>
              <p className="step-desc">Enter your basic login credentials to start your student profile.</p>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-firstName" className="form-label">First Name *</label>
                  <input
                    id="reg-firstName"
                    type="text"
                    name="firstName"
                    className="form-input"
                    placeholder="e.g. Karthik"
                    value={form.firstName}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-lastName" className="form-label">Last Name</label>
                  <input
                    id="reg-lastName"
                    type="text"
                    name="lastName"
                    className="form-input"
                    placeholder="e.g. Kumar"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Type</label>
                <div className="radio-group-horizontal">
                  <label className={`radio-pill ${form.emailType === 'college' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="emailType"
                      value="college"
                      checked={form.emailType === 'college'}
                      onChange={handleChange}
                    />
                    <span>College (.edu / college domain)</span>
                  </label>
                  <label className={`radio-pill ${form.emailType === 'personal' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="emailType"
                      value="personal"
                      checked={form.emailType === 'personal'}
                      onChange={handleChange}
                    />
                    <span>Personal (Gmail, etc.)</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">Email Address *</label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder={form.emailType === 'college' ? 'you@college.edu.in' : 'you@gmail.com'}
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-password" className="form-label">Password * (min 8 chars)</label>
                  <div className="form-input-wrapper">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="form-input form-input-with-icon"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="form-input-icon-btn"
                      onClick={() => setShowPassword((p) => !p)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-confirmPassword" className="form-label">Confirm Password *</label>
                  <div className="form-input-wrapper">
                    <input
                      id="reg-confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      className="form-input form-input-with-icon"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="form-input-icon-btn"
                      onClick={() => setShowConfirm((p) => !p)}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Details */}
          {step === 2 && (
            <div className="register-step-body">
              <h2 className="step-title">Academic Details</h2>
              <p className="step-desc">Connect with students and alumni from your institution.</p>

              <div className="form-group">
                <label htmlFor="reg-college" className="form-label">College / Institute Name *</label>
                <input
                  id="reg-college"
                  type="text"
                  name="college"
                  className="form-input"
                  placeholder="e.g. SR University, Warangal"
                  value={form.college}
                  onChange={handleChange}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-university" className="form-label">Affiliated University / Board</label>
                <input
                  id="reg-university"
                  type="text"
                  name="university"
                  className="form-input"
                  placeholder="e.g. Autonomous / JNTUH"
                  value={form.university}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-degree" className="form-label">Degree</label>
                  <select
                    id="reg-degree"
                    name="degree"
                    className="form-input"
                    value={form.degree}
                    onChange={handleChange}
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E.">B.E.</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="BCA">BCA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="MBA">MBA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-branch" className="form-label">Branch / Department</label>
                  <input
                    id="reg-branch"
                    type="text"
                    name="branch"
                    className="form-input"
                    placeholder="e.g. Computer Science & Engineering"
                    value={form.branch}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-academicYear" className="form-label">Academic Year</label>
                  <select
                    id="reg-academicYear"
                    name="academicYear"
                    className="form-input"
                    value={form.academicYear}
                    onChange={handleChange}
                  >
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                    <option value="Other">Other / Alum</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-gradYear" className="form-label">Graduation Year</label>
                  <input
                    id="reg-gradYear"
                    type="number"
                    name="graduationYear"
                    className="form-input"
                    min="2020"
                    max="2035"
                    value={form.graduationYear}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-city" className="form-label">City</label>
                  <input
                    id="reg-city"
                    type="text"
                    name="city"
                    className="form-input"
                    placeholder="e.g. Warangal"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-state" className="form-label">State</label>
                  <input
                    id="reg-state"
                    type="text"
                    name="state"
                    className="form-input"
                    placeholder="e.g. Telangana"
                    value={form.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {step === 3 && (
            <div className="register-step-body">
              <h2 className="step-title">Your Areas of Interest</h2>
              <p className="step-desc">Pick topics that describe what you love to learn, build, or discuss.</p>

              {Object.entries(INTERESTS_OPTIONS).map(([category, items]) => (
                <div key={category} className="interest-category-block">
                  <div className="category-title">{category}</div>
                  <div className="chip-cloud">
                    {items.map((item) => {
                      const selected = form.interests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          className={`interest-chip ${selected ? 'selected' : ''}`}
                          onClick={() => toggleArrayItem('interests', item)}
                        >
                          {selected ? <Check size={13} /> : null}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="custom-interest-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add custom interest..."
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCustomInterest(e);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleAddCustomInterest}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>

              {form.customInterests.length > 0 && (
                <div className="chip-cloud" style={{ marginTop: '10px' }}>
                  {form.customInterests.map((item) => (
                    <span key={item} className="interest-chip selected custom">
                      <span>{item}</span>
                      <X size={12} onClick={() => handleRemoveCustomInterest(item)} style={{ cursor: 'pointer' }} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Profile Details & Skills */}
          {step === 4 && (
            <div className="register-step-body">
              <h2 className="step-title">Student Profile &amp; Skills</h2>
              <p className="step-desc">Highlight your technical stack, bio, and social portfolio links.</p>

              <div className="form-group">
                <label htmlFor="reg-bio" className="form-label">Bio / Elevator Pitch</label>
                <textarea
                  id="reg-bio"
                  name="bio"
                  className="form-input"
                  rows={3}
                  placeholder="Tell peers what you are currently building, passionate about, or looking for..."
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technical Skills (Press Enter to add)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type skill & press Enter (e.g. React, Docker, PyTorch)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
                <div className="chip-cloud" style={{ marginTop: '8px' }}>
                  {form.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      <span>{skill}</span>
                      <X size={12} onClick={() => handleRemoveSkill(skill)} style={{ cursor: 'pointer' }} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Programming Languages</label>
                <div className="chip-cloud">
                  {POPULAR_LANGUAGES.map((lang) => {
                    const sel = form.programmingLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        className={`interest-chip ${sel ? 'selected' : ''}`}
                        onClick={() => toggleArrayItem('programmingLanguages', lang)}
                      >
                        {sel ? <Check size={13} /> : null}
                        <span>{lang}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tools & Frameworks</label>
                <div className="chip-cloud">
                  {POPULAR_TOOLS.map((t) => {
                    const sel = form.tools.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`interest-chip ${sel ? 'selected' : ''}`}
                        onClick={() => toggleArrayItem('tools', t)}
                      >
                        {sel ? <Check size={13} /> : null}
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="reg-github" className="form-label">GitHub URL</label>
                  <input
                    id="reg-github"
                    type="url"
                    name="githubUrl"
                    className="form-input"
                    placeholder="https://github.com/yourhandle"
                    value={form.githubUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-linkedin" className="form-label">LinkedIn URL</label>
                  <input
                    id="reg-linkedin"
                    type="url"
                    name="linkedinUrl"
                    className="form-input"
                    placeholder="https://linkedin.com/in/yourhandle"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-portfolio" className="form-label">Portfolio / Personal Website</label>
                <input
                  id="reg-portfolio"
                  type="url"
                  name="portfolioUrl"
                  className="form-input"
                  placeholder="https://yourportfolio.dev"
                  value={form.portfolioUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Privacy Controls */}
          {step === 5 && (
            <div className="register-step-body">
              <h2 className="step-title">Profile Visibility</h2>
              <p className="step-desc">Choose who can view your profile and contact you on Vynora Connect.</p>

              <div className="privacy-options-list">
                <label className={`privacy-card ${form.profileVisibility === 'students_only' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="students_only"
                    checked={form.profileVisibility === 'students_only'}
                    onChange={handleChange}
                  />
                  <div className="privacy-card-content">
                    <div className="privacy-card-title">
                      Verified Students Only (Recommended)
                    </div>
                    <div className="privacy-card-sub">
                      Only verified students and professors with valid accounts can view your profile and send invitations.
                    </div>
                  </div>
                </label>

                <label className={`privacy-card ${form.profileVisibility === 'public' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="public"
                    checked={form.profileVisibility === 'public'}
                    onChange={handleChange}
                  />
                  <div className="privacy-card-content">
                    <div className="privacy-card-title">Publicly Visible</div>
                    <div className="privacy-card-sub">
                      Anyone with your Vynora profile link can view your achievements, project portfolio, and bio.
                    </div>
                  </div>
                </label>

                <label className={`privacy-card ${form.profileVisibility === 'connections_only' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="connections_only"
                    checked={form.profileVisibility === 'connections_only'}
                    onChange={handleChange}
                  />
                  <div className="privacy-card-content">
                    <div className="privacy-card-title">Connections Only</div>
                    <div className="privacy-card-sub">
                      Only students you have explicitly accepted as connections can view your full profile and activity.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Finalize */}
          {step === 6 && (
            <div className="register-step-body">
              <h2 className="step-title">Review &amp; Create Profile</h2>
              <p className="step-desc">Confirm your information before launching your Vynora student profile.</p>

              <div className="review-profile-card">
                <div className="review-header">
                  <div className="review-avatar">
                    {(form.firstName || 'S')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="review-name">
                      {form.firstName} {form.lastName}
                    </div>
                    <div className="review-sub">
                      {form.degree} in {form.branch} &bull; {form.college}
                    </div>
                    <div className="review-meta">
                      {form.academicYear} &bull; Class of {form.graduationYear}
                    </div>
                  </div>
                </div>

                <div className="review-divider" />

                <div className="review-section">
                  <div className="review-section-title">Email &amp; Visibility</div>
                  <div className="review-section-val">
                    {form.email} &bull; {form.profileVisibility.replace('_', ' ')}
                  </div>
                </div>

                {form.bio && (
                  <div className="review-section">
                    <div className="review-section-title">Bio</div>
                    <div className="review-section-val">{form.bio}</div>
                  </div>
                )}

                {form.skills.length > 0 && (
                  <div className="review-section">
                    <div className="review-section-title">Skills</div>
                    <div className="chip-cloud">
                      {form.skills.map((s) => (
                        <span key={s} className="skill-chip">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="review-section">
                  <div className="review-section-title">Selected Interests</div>
                  <div className="chip-cloud">
                    {[...form.interests, ...form.customInterests].slice(0, 10).map((i) => (
                      <span key={i} className="interest-chip selected">{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Nav */}
          <div className="register-footer-nav">
            {step > 1 ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleBack}
                disabled={loading}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                id="wizard-next-btn"
              >
                <span>Continue</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                id="wizard-complete-btn"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    <span>Complete Profile</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="auth-form-footer" style={{ marginTop: '20px' }}>
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
