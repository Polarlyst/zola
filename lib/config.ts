import Claude from "@/components/icons/claude"
import DeepSeek from "@/components/icons/deepseek"
import Gemini from "@/components/icons/gemini"
import Grok from "@/components/icons/grok"
import Mistral from "@/components/icons/mistral"
import OpenAI from "@/components/icons/openai"
import OpenRouter from "@/components/icons/openrouter"
import {
  BookOpenText,
  Brain,
  ChalkboardTeacher,
  ChatTeardropText,
  Code,
  CookingPot,
  Heartbeat,
  Lightbulb,
  MagnifyingGlass,
  Notepad,
  PaintBrush,
  PenNib,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr"
import { openproviders, OpenProvidersOptions } from "./openproviders"
import { SupportedModel } from "./openproviders/types"

export const NON_AUTH_DAILY_MESSAGE_LIMIT = 500
export const AUTH_DAILY_MESSAGE_LIMIT = 10000
export const REMAINING_QUERY_ALERT_THRESHOLD = 200
export const DAILY_FILE_UPLOAD_LIMIT = 0
export const DAILY_SPECIAL_AGENT_LIMIT = 200
export const DAILY_LIMIT_PRO_MODELS = 500

export type Model = {
  id: string
  name: string
  provider: string
  available?: boolean
  api_sdk?: OpenProvidersOptions<SupportedModel>
  features?: {
    id: string
    enabled: boolean
  }[]
  description?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const MODELS_FREE = [
  {
    id: "gpt-4.1-nano",
    name: "GPT-4.1 Nano",
    provider: "openai",
    features: [
      {
        id: "file-upload",
        enabled: true,
      },
    ],
    api_sdk: openproviders("gpt-4.1-nano"),
    description:
      "Ultra fast and cheap. Ideal for simple tasks, summaries, or classification.",
    icon: OpenAI,
  },
]

export const MODELS_PRO = [
  {
    id: "gemini-2.5-pro-preview-03-25",
    name: "Gemini 2.5 Pro",
    provider: "gemini",
    features: [
      {
        id: "file-upload",
        enabled: false,
      },
    ],
    api_sdk: openproviders("gemini-2.5-pro-exp-03-25"),
    description: "Advanced reasoning, coding, and multimodal understanding.",
    icon: Gemini,
  },
]

// export const MODELS_NOT_AVAILABLE = [
// {
//     id: "grok-2",
//     name: "Grok 2",
//     provider: "grok",
//     available: false,
//     api_sdk: false,
//     features: [
//       {
//         id: "file-upload",
//         enabled: true,
//       },
//     ],
//     icon: Grok,
//   },
// ] as Model[]

export const MODELS_OPTIONS = [...MODELS_FREE, ...MODELS_PRO] as Model[]

export type Provider = {
  id: string
  name: string
  available: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const PROVIDERS = [
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: OpenRouter,
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: OpenAI,
  },
  {
    id: "mistral",
    name: "Mistral",
    icon: Mistral,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    icon: DeepSeek,
  },
  {
    id: "gemini",
    name: "Gemini",
    icon: Gemini,
  },
  {
    id: "claude",
    name: "Claude",
    icon: Claude,
  },
  {
    id: "grok",
    name: "Grok",
    icon: Grok,
  },
] as Provider[]

export const MODEL_DEFAULT = "gpt-4.1-nano"

export const APP_NAME = "Central"
export const APP_DOMAIN = "https://zola.chat"
export const APP_DESCRIPTION =
  "Project : Central for hostpital"

import {
  Calendar, // ตัวอย่างไอคอน
  HelpCircle, // ตัวอย่างไอคอน
  Phone, // ตัวอย่างไอคอน
  Clipboard, // ตัวอย่างไอคอน
  MapPin, // ตัวอย่างไอคอน
  // เพิ่มไอคอนอื่น ๆ ที่จำเป็นได้
} from "lucide-react"; // สมมติว่าใช้ lucide-react หรือไลบรารีไอคอนอื่น ๆ

export const SUGGESTIONS = [
  {
    label: "นัดหมาย", // Appointments
    highlight: "นัดหมายสำหรับ", // Appointment for
    prompt: `ช่วยเรื่องการนัดหมายสำหรับ`, // Help with appointment for
    items: [
      "ทำนัดผู้ป่วยใหม่กับแพทย์หญิง อัญญา ชาร์มา", // Schedule a new patient appointment with Dr. Anya Sharma
      "เลื่อนนัดติดตามผลของ มาเรีย การ์เซีย เป็นวันพฤหัสหน้า", // Reschedule Maria Garcia's follow-up for next Thursday
      "ตรวจสอบตารางว่างของแพทย์เชน เช้าวันจันทร์", // Check Dr. Chen's availability on Monday morning
      "ยกเลิกนัดเวลา 14:00 น. ของ เดวิด ลี", // Cancel the 2 PM appointment for David Lee
      "ยืนยันรายละเอียดนัดหมายสำหรับผู้ป่วย จอห์น สมิธ, ว/ด/ป เกิด 15/03/1975", // Confirm appointment details for patient John Smith, DOB 03/15/1975
    ],
    icon: Calendar,
  },
  {
    label: "ข้อมูล รพ.", // Hospital Info
    highlight: "สอบถามเกี่ยวกับ", // Tell me about
    prompt: `สอบถามข้อมูลเกี่ยวกับ`, // Tell me about
    items: [
      "สอบถามเกี่ยวกับเวลาเยี่ยมผู้ป่วยปัจจุบัน", // Tell me about the current visiting hours
      "สอบถามเกี่ยวกับที่จอดรถและค่าบริการ", // Tell me about parking options and fees
      "สอบถามเกี่ยวกับที่ตั้งแผนกรังสีวิทยา", // Tell me about the location of the Radiology department
      "สอบถามเกี่ยวกับสิทธิ์ประกันที่โรงพยาบาลรับ", // Tell me about accepted insurance plans
      "สอบถามเกี่ยวกับขั้นตอนการขอเวชระเบียน", // Tell me about the process for requesting medical records
    ],
    icon: HelpCircle, // หรือไอคอน Info
  },
  {
    label: "การสื่อสาร", // Communication
    highlight: "ฝากข้อความถึง", // Message for
    prompt: `รับฝากข้อความถึง`, // Take a message for
    items: [
      "รับฝากข้อความถึงคุณหมอมิลเลอร์ เรื่องสอบถามผลตรวจคนไข้", // Take a message for Dr. Miller regarding patient results query
      "รับฝากข้อความถึงพยาบาลพาเทล เรื่องขอใบสั่งยาเพิ่ม", // Take a message for Nurse Patel about a prescription refill
      "ขอเบอร์ติดต่อตรงแผนกการเงิน", // Find the direct line for the Billing Department
      "โอนสายไปยังหน่วยกายภาพบำบัด", // Transfer call to the Physical Therapy unit
      "ตรวจสอบว่าแพทย์ท่านใดอยู่เวรแผนกหัวใจ", // Check who is the on-call physician for Cardiology
    ],
    icon: Phone,
  },
  {
    label: "ขั้นตอน", // Procedures
    highlight: "อธิบายขั้นตอน", // Explain the process for
    prompt: `อธิบายขั้นตอนสำหรับ`, // Explain the process for
    items: [
      "อธิบายขั้นตอนการลงทะเบียนผู้ป่วยใหม่", // Explain the process for checking in a new patient
      "อธิบายขั้นตอนการตรวจเลือด/เจาะเลือด", // Explain the process for getting lab work done
      "อธิบายขั้นตอนการจำหน่ายผู้ป่วยกลับบ้าน", // Explain the process for patient discharge
      "อธิบายขั้นตอนการลงทะเบียนก่อนผ่าตัด", // Explain the process for pre-surgery registration
      "อธิบายขั้นตอนการให้ข้อเสนอแนะหรือร้องเรียน", // Explain the process for providing feedback or complaints
    ],
    icon: Clipboard,
  },
  {
    label: "บอกทาง", // Directions
    highlight: "เส้นทางไป", // Directions to
    prompt: `บอกเส้นทางไป`, // Provide directions to
    items: [
      "บอกเส้นทางไปโรงอาหารของโรงพยาบาล", // Provide directions to the hospital cafeteria
      "บอกเส้นทางไปห้องน้ำที่ใกล้ที่สุด", // Provide directions to the nearest restroom
      "บอกเส้นทางไปทางเข้าแผนกฉุกเฉิน", // Provide directions to the Emergency Department entrance
      "บอกเส้นทางไปร้านขายยาผู้ป่วยนอก", // Provide directions to the outpatient pharmacy
      "บอกเส้นทางไปล็อบบี้หลักจากลานจอดรถฝั่งตะวันตก", // Provide directions to the main lobby from the west parking garage
    ],
    icon: MapPin,
  },
];

export const SYSTEM_PROMPT_DEFAULT = `You are Central, a Thai head hostipal receptionist. You must tell user who are you, give advice and end with asking for user location to tell user to contact your suborinate by their location. list of your suboridate is 
  "Phayathai 1": "ไลร่ำ พยาบาลพญาไท 1" : ถนนศรีอยุธยา แขวงถนนพญาไท เขตราชเทวี กรุงเทพฯ ใกล้อนุสาวรีย์ชัยสมรภูมิและสถานี BTS พญาไท call 0-2201-4600 or 1772 ,
  "Phayathai 2": "สายป่าน": ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400 อยู่ติดถนนใหญ่ระหว่างสถานี BTS สนามเป้าและสะพานควาย call 0-2617-2444  or 1772 ,
  "Phayathai 3": "แป้ง" : ถนนเพชรเกษม 19 แขวงปากคลองภาษีเจริญ เขตภาษีเจริญ กรุงเทพฯ 10160 อยู่ใกล้สถานี BTS บางหว้า/MRT บางหว้า call 0-2467-1111 or 1772 ,
  "Sriracha": "สายป่าน": ตำบลศรีราชา อำเภอศรีราชา จังหวัดชลบุรี 20110 โรงพยาบาลตั้งอยู่ใจกลางเมืองศรีราชา ใกล้กับโรบินสันศรีราชา call โทร. 0-3831-7333 or 1772 ,
  "Paolo Phaholyothin": "เปา" : ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400 อยู่ใกล้สี่แยกสะพานควาย (สถานี BTS สะพานควาย) ทำให้เดินทางสะดวกทั้งรถยนต์และรถไฟฟ้า call 0-2271-7000  or 1772,
  "Paolo Rangsit": "เปา" : ถนนรังสิต-นครนายก ตำบลประชาธิปัตย์ อำเภอธัญบุรี จังหวัดปทุมธานี 12130 อยู่ใกล้ฟิวเจอร์พาร์ครังสิต call 0-2577-8111 or 1772 ,
  "ChokChai": "ไชยยา" : แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพมหานคร 10230 อยู่ต้นถนนโชคชัย 4 (ไม่ไกลจากถนนลาดพร้าวบริเวณซอย 53) ทำเลอยู่ในย่านที่อยู่อาศัยซึ่งสะดวกสำหรับผู้พักอาศัยย่านลาดพร้าว-วังหิน โทร. 0-2514-4140-9 ,
  "Paolo Kaset": "ไก": ถ.พหลโยธิน (บริเวณสี่แยกเกษตร) แขวงเสนานิคม เขตจตุจักร กรุงเทพฯ 10900 โรงพยาบาลตั้งอยู่ตรงสี่แยกเกษตรพอดี (ใกล้มหาวิทยาลัยเกษตรศาสตร์) ซึ่งเป็นจุดตัดระหว่างถนนพหลโยธินกับถนนงามวงศ์วาน โทร. 0-21500-900  ,
  "Paolo Samutprakarn": "วาฟ" : ถนนศรีนครินทร์ ต.บางเมือง อ.เมืองสมุทรปราการ จ.สมุทรปราการ 10270 โรงพยาบาลตั้งอยู่บนถนนศรีนครินทร์ช่วงสมุทรปราการ (ระหว่างแยกเทพารักษ์และแยกการไฟฟ้าฯ)โทร. 0-2363-2000  ,
  "Paolo Phrapradeng": "เปา": ถนนสุขสวัสดิ์ ตำบลปากคลองบางปลากด อำเภอพระสมุทรเจดีย์ จังหวัดสมุทรปราการ 10290 โรงพยาบาลตั้งอยู่ริมถนนสุขสวัสดิ์ ช่วงอำเภอพระสมุทรเจดีย์ (บริเวณตลาดคู่สร้าง) โทร. 0-2818-9000 and You can understand user requests for scheduling meetings or appointments, clarify any missing details (like date, time, title, attendees/description), and then confirm the final details.

**CRITICAL INSTRUCTION:** Once you have confirmed the final details of an appointment with the user (including title, date in YYYY-MM-DD format, and startTime in HH:MM 24-hour format), you MUST use the `scheduleEvent` tool to record this information. Provide all the gathered details (title, date, startTime, and optionally endTime, description, location) as arguments to the tool. After calling the tool, you can provide a short confirmation message to the user like "Okay, I've scheduled that for you." or similar.`

export const MESSAGE_MAX_LENGTH = 4999

export const ZOLA_AGENTS_SLUGS = [
  "tweet-vibe-checker",
  "clear-ux-copywriter",
  "0-to-1-advisor",
  "pull-check",
  "blog-draft",
  "inbox-fix",
  "name-vibe-check",
  "tiny-essay",
  "solene",
  "eloi",
]

export const ZOLA_SPECIAL_AGENTS_SLUGS = ["research"]

export const ZOLA_COMING_SOON_AGENTS = [
  {
    name: "Wellposttrack",
    slug: "Wellposttrack",
    description:
      "Analyze Office syndrome with Wellposttrack",
    avatar_url: null,
    system_prompt: "",
    model_preference: "gpt-4o-mini",
    is_public: false,
    remixable: false,
    tools_enabled: true,
    example_inputs: [
      "Summarize this PR: [paste PR link]",
      "Generate release notes from these commits",
    ],
    tags: ["dev", "github", "tools"],
    category: "dev",
    id: "github-agent",
    creator_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
