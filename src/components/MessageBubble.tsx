
"use client";
import { type Message } from "@/lib/ijccKnowledge";

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline">$1</a>')
    .replace(/^- (.+)$/gm, "<li style='margin-left:1rem;list-style:disc'>$1</li>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default function MessageBubble({ message, isLatest }: { message: Message; isLatest: boolean }) {
  const isUser = message.role === "user";
  const dateObj = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp || Date.now());
  const timeStr = isNaN(dateObj.getTime()) ? "" : dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (isUser) {
    return (
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"8px" }}>
        <div style={{ maxWidth:"80%", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
          <div style={{ padding:"10px 14px", borderRadius:"18px 18px 4px 18px", background:"linear-gradient(135deg,#C8102E,#A00D25)", color:"#fff", fontSize:"14px", lineHeight:"1.5" }}>
            {message.content}
          </div>
          <span style={{ fontSize:"11px", color:"#9ca3af" }}>{timeStr}</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display:"flex", gap:"8px", alignItems:"flex-end", marginBottom:"8px" }}>
      <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#C8102E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <span style={{ color:"#fff", fontSize:"12px", fontWeight:"bold" }}>I</span>
      </div>
      <div style={{ maxWidth:"85%", display:"flex", flexDirection:"column", gap:"4px" }}>
        <div style={{ padding:"10px 14px", borderRadius:"18px 18px 18px 4px", background:"#fff", border:"1px solid #e5e7eb", fontSize:"14px", lineHeight:"1.6", color:"#1f2937" }}>
          {message.content
            ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
            : <div style={{ display:"flex", gap:"4px", alignItems:"center", height:"20px" }}>
                {[0,200,400].map(d => (
                  <div key={d} style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#C8102E", animation:`bounce 1.2s ${d}ms ease-in-out infinite` }} />
                ))}
              </div>
          }
        </div>
        <span style={{ fontSize:"11px", color:"#9ca3af", marginLeft:"4px" }}>{timeStr}</span>
      </div>
    </div>
  );
}
