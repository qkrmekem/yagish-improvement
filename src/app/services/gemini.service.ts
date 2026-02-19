import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';

export interface AiGenerateRequest {
  companyName: string;
  position: string;
  type: 'motivation' | 'strengths' | 'selfIntro';
  additionalInfo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: environment.geminiApiKey });
  }

  async generateText(request: AiGenerateRequest): Promise<string> {
    const prompt = this.buildPrompt(request);

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || '생성에 실패했습니다.';
    } catch (error: any) {
      console.error('Gemini API Error:', error);

      if (error?.message?.includes('429') || error?.status === 429) {
        throw new Error('요청 횟수 제한에 도달했습니다. 1분 후 다시 시도해주세요.');
      }
      if (error?.message?.includes('403') || error?.status === 403) {
        throw new Error('API 키가 유효하지 않습니다.');
      }
      throw new Error('AI 생성에 실패했습니다: ' + (error?.message || '알 수 없는 오류'));
    }
  }

  private buildPrompt(request: AiGenerateRequest): string {
    const { companyName, position, type, additionalInfo } = request;

    const prompts = {
      motivation: `당신은 이력서 작성 전문가입니다. 다음 조건에 맞는 지원동기를 작성해주세요:
- 회사: ${companyName}
- 지원 직무: ${position}
${additionalInfo ? `- 추가 정보: ${additionalInfo}` : ''}

요구사항:
- 한국어로 작성
- 200-300자 내외
- 구체적이고 진정성 있게
- 해당 회사/직무에 특화된 내용
- 열정과 성장 의지를 담아서

지원동기:`,

      strengths: `당신은 이력서 작성 전문가입니다. 다음 조건에 맞는 강점/장점을 작성해주세요:
- 지원 회사: ${companyName}
- 지원 직무: ${position}
${additionalInfo ? `- 추가 정보: ${additionalInfo}` : ''}

요구사항:
- 한국어로 작성
- 150-250자 내외
- 직무에 관련된 구체적 강점
- STAR 기법 활용 (상황-과제-행동-결과)

강점:`,

      selfIntro: `당신은 이력서 작성 전문가입니다. 다음 조건에 맞는 자기소개를 작성해주세요:
- 회사: ${companyName}
- 직무: ${position}
${additionalInfo ? `- 추가 정보: ${additionalInfo}` : ''}

요구사항:
- 한국어로 작성
- 300-400자 내외
- 전문적이면서 인간적인 톤
- 경험과 역량을 구체적으로

자기소개:`
    };

    return prompts[type];
  }
}
