import type { Course } from "@/types/course.types";

export function courseTemplate(course: Course): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${course.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            margin: 0;
            padding: 0;
            color: #F0F2F8;
            background: #0D0F14;
          }
          .hero {
            width: 100%;
            max-height: 240px;
            object-fit: cover;
          }
          .content {
            padding: 20px;
          }
          .chip {
            display: inline-block;
            background: rgba(108, 99, 255, 0.12);
            color: #6C63FF;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 3px 8px;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          .title {
            font-size: 22px;
            font-weight: 700;
            margin: 8px 0;
            color: #F0F2F8;
          }
          .price {
            font-size: 22px;
            font-weight: 700;
            color: #6C63FF;
            margin: 6px 0 16px;
          }
          .instructor-card {
            background: #161B25;
            border-radius: 12px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }
          .instructor-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            background: #1E2535;
          }
          .instructor-name {
            font-size: 13px;
            font-weight: 600;
            color: #F0F2F8;
          }
          .instructor-role {
            font-size: 11px;
            color: #8892A4;
          }
          .description {
            font-size: 13px;
            line-height: 1.7;
            color: #8892A4;
            margin: 16px 0 24px;
          }
          .button {
            width: 100%;
            border: none;
            border-radius: 12px;
            background: #6C63FF;
            color: white;
            font-size: 14px;
            font-weight: 600;
            padding: 14px;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
          .button:active {
            opacity: 0.85;
            transform: scale(0.97);
          }
        </style>
      </head>
      <body>
        <img src="${course.thumbnail}" class="hero" alt="${course.title}" />
        <div class="content">
          <span class="chip">${course.category}</span>
          <h1 class="title">${course.title}</h1>
          <p class="price">${course.price === 0 ? "Free" : "$" + course.price}</p>
          <div class="instructor-card">
            <img src="${course.instructor.avatar ?? ""}" class="instructor-avatar" alt="${course.instructor.name}" />
            <div>
              <div class="instructor-name">${course.instructor.name}</div>
              <div class="instructor-role">Instructor</div>
            </div>
          </div>
          <p class="description">${course.description}</p>
          <button class="button" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ENROLL', payload: { courseId: '${course.id}' } }))">
            Enroll Now
          </button>
        </div>
      </body>
    </html>
  `;
}
