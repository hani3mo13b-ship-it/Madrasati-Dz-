import { GoogleGenAI } from "@google/genai";
import { ALGERIAN_SOURCES } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStudyAdvice = async (year: string, subject: string, term: string) => {
  const client = getClient();
  if (!client) return "عذراً، خدمة الذكاء الاصطناعي غير متوفرة حالياً.";

  try {
    const prompt = `أنت خبير تعليمي في المناهج الدراسية الجزائرية.
    قدم خطة مراجعة قصيرة جداً (3 نقاط) لأهم الدروس في مادة ${subject} لـ ${year} في ${term}.
    ركز على المواضيع التي تتكرر في الامتحانات الرسمية (البيام أو البكالوريا إذا كانت سنة نهائية).`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء جلب النصائح الدراسية. تأكد من الاتصال بالإنترنت.";
  }
};

export const solveHomeworkWithImage = async (imageBase64: string, userPrompt: string = "") => {
  const client = getClient();
  if (!client) return "عذراً، الخدمة غير متوفرة.";

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');
    
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', 
            },
          },
          {
            text: userPrompt || "قم بحل هذا التمرين الدراسي الجزائري خطوة بخطوة. إذا كان نصاً، قم بتلخيصه وشرحه. قدم الإجابة بتنسيق جميل ومفهوم لتلميذ.",
          },
        ],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "عذراً، لم أتمكن من تحليل الصورة. حاول التقاط صورة أوضح.";
  }
};

export const prepareLessonText = async (textTitle: string, year: string) => {
  const client = getClient();
  if (!client) return "عذراً، الخدمة غير متوفرة.";

  try {
    // Enhanced prompt to handle spelling errors and missing diacritics
    const prompt = `
      أنت أستاذ لغة عربية خبير في مناهج الجيل الثاني الجزائرية لـ ${year}.
      
      المطلوب: تحضير نص القراءة الذي عنوانه تقريباً: "${textTitle}".
      
      ⚠️ تعليمات هامة جداً للتعامل مع العنوان:
      1. المستخدم قد يكتب العنوان بأخطاء إملائية، بدون همزات (مثل "ماسح الاحذية" بدلاً من "ماسح الأحذية")، أو بدون "ال" التعريف.
      2. ابحث في ذاكرتك عن أقرب نص مشهور في الكتاب المدرسي يطابق هذا العنوان ولو جزئياً.
      3. إذا كان العنوان غامضاً جداً، قدم تحضيراً لأشهر نص في هذا المستوى.
      
      قدم التحضير بهذا التنسيق المنظم:
      **العنوان الصحيح**: (اكتب العنوان كما ورد في الكتاب)
      
      1. **الفكرة العامة**: (فكرة موجزة ودقيقة وشاملة للنص).
      2. **الأفكار الأساسية**: (قسم النص إلى 3 أو 4 أفكار جزئية مرتبة).
      3. **المغزى العام**: (القيمة التربوية أو الحكمة المستخلصة من النص).
      4. **شرح المفردات**: (شرح 3 كلمات صعبة من النص).
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Text Prep Error:", error);
    return "عذراً، حدث خطأ أثناء تحضير النص. حاول كتابة العنوان بشكل أدق.";
  }
};

export const generateExam = async (subject: string, year: string, term: string) => {
  const client = getClient();
  if (!client) return "عذراً، الخدمة غير متوفرة.";

  try {
    const prompt = `
      قم بإنشاء موضوع اختبار (أو فرض) كامل لمادة ${subject} لـ ${year}، ${term}.
      
      الهيكل المطلوب:
      - **التمرين الأول**: (أسئلة مباشرة حول الدروس، أو إعراب وبناء لغوي إذا عربية).
      - **التمرين الثاني**: (مسألة رياضية أو تحليل ظاهرة).
      - **الوضعية الإدماجية**: (سياق، سند، تعليمات).
      
      اجعل الأسئلة مطابقة تماماً للمنهاج الوزاري الجزائري.
      لا تضع الحل، ضع فقط الأسئلة بشكل منظم وجاهز للطباعة.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Exam Gen Error:", error);
    return "حدث خطأ أثناء إنشاء الاختبار.";
  }
};

export const chatWithTutor = async (message: string, history: string[]) => {
  const client = getClient();
  if (!client) return "عذراً، الخدمة غير متوفرة.";

  try {
    const prompt = `أنت "مدرستي"، مساعد ذكي شامل.
    مهمتك مساعدة التلاميذ الجزائريين.
    
    سياق المحادثة:
    ${history.join('\n')}
    
    السؤال الحالي: "${message}"
    
    اجب بإيجاز، واستخدم المصطلحات المستخدمة في المدارس الجزائرية.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    return "عذراً، حدث خطأ.";
  }
};

export const searchYouTubeVideos = async (query: string) => {
  const client = getClient();
  if (!client) return [];

  try {
    // Strategy: Try to get REAL links using grounding. 
    // If strict links fail, return a "Search Suggestion" which creates a safe YouTube search link.
    const prompt = `Find 3 excellent educational YouTube videos for the Algerian curriculum query: "${query}".
    Prefer channels like 'Prof Noureddine', 'Bouchra Education', 'Teacher Djalal', but accept any high quality Algerian teacher.
    
    If you find real videos using Google Search, return them.
    If you cannot verify the video URL, suggest the best specific search query to find it.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let videos: { id: string; title: string; channel: string }[] = [];
    const videoIds = new Set<string>();

    const getVideoId = (url: string) => {
      const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return match ? match[1] : null;
    };

    // 1. Extract from Grounding (High Confidence)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach(c => {
      const url = c.web?.uri || '';
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const id = getVideoId(url);
        // Only accept if ID looks valid
        if (id && !videoIds.has(id)) {
          videoIds.add(id);
          videos.push({
            id,
            title: c.web?.title?.replace(/- YouTube$/, '') || 'درس فيديو',
            channel: 'YouTube'
          });
        }
      }
    });

    // 2. Safe Fallback: If no real playable videos found, create a "Search Card"
    // This fixes the "Video Unavailable" issue by sending user to search page instead of broken ID
    if (videos.length === 0) {
        videos.push({
            id: 'SEARCH_FALLBACK',
            title: `بحث يوتيوب: ${query}`,
            channel: 'نتائج البحث'
        });
        // Add a specific one if possible
        videos.push({
            id: 'SEARCH_FALLBACK_2',
            title: `ملخص ${query} (الأستاذ نور الدين/بورنان)`,
            channel: 'مقترح ذكي'
        });
    }

    return videos.slice(0, 4);
  } catch (error) {
    console.error("Video Search Error:", error);
    // Ultimate fallback
    return [{
        id: 'SEARCH_FALLBACK',
        title: `شاهد شرح: ${query}`,
        channel: 'بحث مباشر'
    }];
  }
};