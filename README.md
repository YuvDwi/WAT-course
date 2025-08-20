# WATCourse | Data Driven Course Recommendations

<div align="center">
  <img src="public/WC.png" alt="WATCourse Logo" width="120" height="120">
  <h3>Intelligent course recommendations powered by machine learning</h3>
  <p>Upload your transcript and get personalized course suggestions based on your academic strengths, interests, and comprehensive student review data.</p>
</div>

## Features

WATCourse helps students discover their next courses by analyzing their academic history and matching it with comprehensive course data. Here's what it does:

- **PDF Transcript Analysis**: Parses academic transcripts using pdfminer.six to extract course codes and grades
- **Machine Learning Recommendations**: Uses vector embeddings and cosine similarity to find courses that match your academic profile
- **Student Review Integration**: Incorporates real student feedback from UWFlow using natural language processing
- **Personalized Scoring**: Balances course similarity with practical factors like difficulty, usefulness, and student satisfaction
- **Department Diversity**: Makes sure recommendations aren't all from the same department to encourage well-rounded exploration
- **Privacy Focused**: Your transcript is processed and immediately deleted - no personal data is stored anywhere
- **Fast Results**: Get recommendations in under 5 seconds

## Architecture

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

## How It Works

The recommendation process happens in several steps:

### 1. PDF Text Extraction
First, we extract text from your uploaded transcript using pdfminer.six. This library is really good at pulling text out of PDFs while preserving the structure, which helps us find course codes and grades.

### 2. Course Recognition
We use regex patterns to find course codes in the extracted text. The patterns look for things like "CS240" or "MATH135" - basically department codes followed by course numbers. This works across all University of Waterloo departments.

### 3. Vector Similarity Analysis
This is where the machine learning happens. Each course in our database has a 384-dimensional vector that represents its content and characteristics. We average the vectors of your completed courses to create your "academic profile", then find other courses with similar vectors using cosine similarity.

### 4. Smart Filtering & Scoring
Raw similarity isn't everything - we also consider practical factors. The final score combines similarity (70%) with a quality score (30%) that factors in student satisfaction, course difficulty, and usefulness. The formula is:
```
quality_score = (0.4 * satisfaction + 0.3 * easiness + 0.3 * usefulness)
```

### 5. Department Diversity
Finally, we make sure recommendations aren't all from the same department. The algorithm does two passes - first picking the best course from each department, then filling remaining slots with the next best overall matches.

## Project Structure

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

## Installation & Setup

You'll need Node.js 18+, Python 3.11+, and Git installed.

### Running the Frontend
```bash
git clone https://github.com/YuvDwi/WAT-course.git
cd WAT-course
npm install
npm run dev
```

The frontend will be available at `localhost:3000`.

### Running the Backend
```bash
pip install -r requirements.txt
python3 main.py
```

The API will start on `localhost:12000`.

### Environment Variables
For the frontend to connect to your backend, create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:12000
```

For production, point this to your deployed Railway app URL.

## Deployment

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

## Development

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

## Technical Specifications

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

## Performance & Scale

The system currently handles:
- Response times under 5 seconds for most uploads
- A database of 916 University of Waterloo courses
- 384-dimensional embeddings for each course
- Coverage across 50+ academic departments
- Student review data from thousands of UWFlow submissions

## Contributing

I'd love help making this better! If you want to contribute:

1. Fork the repo
2. Make a new branch for your feature
3. Make your changes and test them
4. Commit with a clear message
5. Push and open a pull request

A few things to keep in mind:
- Try to follow the existing code style
- Test any ML changes carefully since they affect recommendations
- Make sure everything works on mobile
- Add error handling where it makes sense

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **UWFlow** for student review data
- **University of Waterloo** for course information
- **Sentence Transformers** for embedding models
- **FastAPI** and **Next.js** communities for excellent frameworks

## Contact

- **GitHub**: [YuvDwi/WAT-course](https://github.com/YuvDwi/WAT-course)
- **Demo**: [WATCourse Live App](https://your-vercel-app.vercel.app)

---

<div align="center">
  <p>Built for students, by students</p>
  <p>Making course selection smarter, one transcript at a time</p>
</div>
