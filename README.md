# WATCourse | Data Driven Course Recommendations

<div align="center">
  <img src="public/WC.png" alt="WATCourse Logo" width="120" height="120">
  <h3>Intelligent course recommendations powered by machine learning</h3>
  <p>Upload your transcript and get personalized course suggestions based on your academic strengths, interests, and comprehensive student review data.</p>
</div>

## 🚀 Features

- **📄 PDF Transcript Analysis**: Advanced parsing of academic transcripts using pdfminer.six
- **🧠 Machine Learning Recommendations**: Vector embeddings and cosine similarity for intelligent course matching
- **📊 Student Review Integration**: Natural language processing of UWFlow student reviews
- **🎯 Personalized Scoring**: Balanced algorithm considering easiness, usefulness, and student satisfaction
- **🌈 Department Diversity**: Ensures recommendations span different academic departments
- **🔒 Privacy First**: No personal data stored, transcripts deleted after processing
- **⚡ Real-time Results**: Sub-5 second analysis and recommendation generation

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Deployed on Vercel**

### Backend
- **FastAPI** Python web framework
- **Machine Learning Stack**:
  - `numpy` for numerical operations
  - `scikit-learn` for cosine similarity calculations
  - Pre-computed 384-dimensional sentence embeddings
- **PDF Processing**: `pdfminer.six` for text extraction
- **Deployed on Railway**

### Data Pipeline
- **Course Database**: 916 university courses with metadata
- **Review Processing**: Extracted from UWFlow and processed with NLP
- **Embedding Generation**: Local pre-computation for production efficiency

## 🤖 How It Works

### 1. PDF Text Extraction
```python
from pdfminer.high_level import extract_text
extracted_text = extract_text(pdf_file)
```
- Parses uploaded transcripts using pdfminer.six
- Extracts course codes and grades using regex patterns
- Identifies academic strengths and weaknesses

### 2. Course Recognition
```python
# Regex patterns for course detection
course_codes = re.findall(r'^[A-Z]{2,5}$', text)
course_numbers = re.findall(r'^\d+[A-Z]*$', text)
```
- Recognizes courses from 50+ academic departments
- Maps completed courses to our database
- Validates course code formats

### 3. Vector Similarity Analysis
```python
# Cosine similarity calculation
profile_embedding = np.mean(completed_embeddings, axis=0)
similarities = cosine_similarity(profile_embedding, all_embeddings)
```
- Creates user profile from completed course embeddings
- Computes similarity with all available courses
- Uses pre-computed 384D sentence embeddings

### 4. Smart Filtering & Scoring
```python
# Balanced scoring algorithm
quality_score = (0.4 * liked_pct + 0.3 * easy_pct + 0.3 * useful_pct) / 100
final_score = 0.7 * similarity_score + 0.3 * quality_score
```
- Filters courses with minimum satisfaction thresholds
- Balances content similarity with course quality metrics
- Emphasizes student feedback and course difficulty

### 5. Department Diversity
```python
# Two-pass selection for diversity
for course in candidates:
    dept = course[:2]
    if dept not in used_departments:
        recommendations.append(course)
        used_departments.add(dept)
```
- Ensures recommendations span different departments
- Promotes well-rounded academic exploration
- Prevents over-concentration in single subjects

## 📁 Project Structure

```
CoursePick/
├── app/                    # Next.js app directory
│   ├── about/             # How it works page
│   ├── results/           # Results display page
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── hero.tsx          # Main hero section with upload
│   ├── navbar.tsx        # Navigation component
│   └── ui/               # Shadcn UI components
├── main.py               # FastAPI backend server
├── reccomender.py        # ML recommendation engine
├── pdfparser.py          # PDF processing utilities
├── embedded_coursesfinal.json  # Course database with embeddings
├── generate_embeddings.py     # Local embedding generation
└── requirements.txt      # Python dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/YuvDwi/WAT-course.git
cd WAT-course

# Install dependencies
npm install

# Run development server
npm run dev
```

### Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI server
python3 main.py
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app

# Backend (Railway)
# No additional environment variables required
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL`
3. Deploy automatically on push to main

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set start command: `python3 main.py`
3. Use `runtime.txt` to specify Python 3.11.9
4. Deploy automatically on push to main

### Key Configuration Files
- `Procfile`: Railway process definition
- `runtime.txt`: Python version specification
- `start.sh`: Alternative startup script
- `requirements.txt`: Python dependencies

## 🔧 Development

### Adding New Courses
1. Update `embedded_coursesfinal.json` with course metadata
2. Run `generate_embeddings.py` to compute embeddings locally
3. Deploy updated dataset

### Modifying Recommendation Logic
- Edit scoring weights in `reccomender.py`
- Adjust filtering thresholds
- Modify diversity algorithms

### Testing Locally
```bash
# Start backend
python3 main.py

# Start frontend (new terminal)
npm run dev

# Test upload at localhost:3000
```

## 📊 Technical Specifications

| Component | Technology | Purpose |
|-----------|------------|---------|
| **PDF Processing** | pdfminer.six | Text extraction from transcripts |
| **ML Engine** | scikit-learn + numpy | Cosine similarity calculations |
| **Embeddings** | Pre-computed 384D vectors | Course content representation |
| **Database** | JSON (916 courses) | Course metadata and reviews |
| **API** | FastAPI | Backend web framework |
| **Frontend** | Next.js 14 | React-based user interface |
| **Styling** | Tailwind CSS | Responsive design system |
| **Deployment** | Railway + Vercel | Cloud hosting platforms |

## 🎯 Performance Metrics

- **Response Time**: < 5 seconds average
- **Course Database**: 916 university courses
- **Embedding Dimensions**: 384D sentence vectors
- **Analysis Accuracy**: Content-based filtering with student feedback
- **Department Coverage**: 50+ academic departments

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain Python code style with proper documentation
- Test ML algorithm changes thoroughly
- Ensure responsive design compatibility
- Add appropriate error handling

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **UWFlow** for student review data
- **University of Waterloo** for course information
- **Sentence Transformers** for embedding models
- **FastAPI** and **Next.js** communities for excellent frameworks

## 📬 Contact

- **GitHub**: [YuvDwi/WAT-course](https://github.com/YuvDwi/WAT-course)
- **Demo**: [WATCourse Live App](https://your-vercel-app.vercel.app)

---

<div align="center">
  <p>Built with ❤️ for students, by students</p>
  <p>Making course selection smarter, one transcript at a time</p>
</div>
