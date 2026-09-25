"""Gera o PDF de passagem a partir do guia Markdown; requer reportlab."""
from pathlib import Path
import re
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Preformatted, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4

root = Path(__file__).resolve().parents[2]
source = root / 'docs/entrega/guia-deploy-e-evidencias-v2.md'
out = root / 'output/pdf/IBIToken-Guia-Deploy-Evidencias-v2.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
fontdir = Path('/System/Library/Fonts/Supplemental')
if (fontdir / 'Arial.ttf').exists():
    for name, file in [('Body','Arial.ttf'),('BodyBold','Arial Bold.ttf'),('BodyItalic','Arial Italic.ttf'),('Display','Georgia.ttf')]:
        pdfmetrics.registerFont(TTFont(name, str(fontdir / file)))
    pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='BodyItalic',boldItalic='BodyBold')
else:
    # Alternativa portável sem fontes adicionais; o texto é majoritariamente latino.
    from reportlab.pdfbase.pdfmetrics import Font
    for alias, name in [('Body','Helvetica'),('BodyBold','Helvetica-Bold'),('BodyItalic','Helvetica-Oblique'),('Display','Times-Roman')]:
        pdfmetrics.registerFont(Font(alias,name,'WinAnsiEncoding'))
    pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='BodyItalic',boldItalic='BodyBold')
green=HexColor('#30483b'); ink=HexColor('#263c30'); muted=HexColor('#59625b'); line=HexColor('#d2dbd0')
styles={
 'p':ParagraphStyle('p',fontName='Body',fontSize=10.5,leading=15.2,textColor=ink,spaceAfter=9),
 'h2':ParagraphStyle('h2',fontName='Display',fontSize=19,leading=24,textColor=green,spaceBefore=18,spaceAfter=12,keepWithNext=True),
 'h3':ParagraphStyle('h3',fontName='BodyBold',fontSize=11.2,leading=15.5,textColor=green,spaceBefore=10,spaceAfter=7,keepWithNext=True),
 'li':ParagraphStyle('li',fontName='Body',fontSize=10.5,leading=15.2,textColor=ink,leftIndent=13,firstLineIndent=-10,spaceAfter=7),
 'small':ParagraphStyle('small',fontName='Body',fontSize=9,leading=13,textColor=muted,spaceAfter=10),
 'cover':ParagraphStyle('cover',fontName='Display',fontSize=34,leading=39,textColor=green,spaceAfter=25),
 'code':ParagraphStyle('code',fontName='Courier',fontSize=8.6,leading=12,textColor=ink,backColor=HexColor('#eff2eb'),borderPadding=10,spaceBefore=9,spaceAfter=12),
}
for style in styles.values():
    style.allowWidows = 0
    style.allowOrphans = 0
def inline(s):
    s=escape(s.replace('—','-').replace('–','-').replace('‑','-'))
    s=re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)',lambda m:f'<link href="{m[2]}" color="#30483b"><u>{m[1]}</u></link>',s)
    s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s)
    s=re.sub(r'`([^`]+)`',r'<font name="Courier" size="9">\1</font>',s)
    return s
story=[]
story.append(Paragraph('IBITI / G01 · PREPARAÇÃO DA ENTREGA',styles['small']))
story.append(Spacer(1,34))
story.append(Paragraph('Deploy e evidências<br/>operacionais on-chain',styles['cover']))
story.append(Paragraph('Guia de passagem para o responsável pelo artefato',styles['h3']))
story.append(Paragraph('Próxima entrega oficial: v2<br/>Revisão da fonte e dos procedimentos: 25 de setembro de 2026',styles['p']))
story.append(Spacer(1,18))
story.append(Paragraph('Este material organiza a execução, a coleta de evidências e a interpretação crítica. O relatório final deverá ser escrito em inglês, com resultados efetivamente observados em rede de testes.',styles['p']))
story.append(Paragraph('<b>Estado da versão:</b> somente a v1 foi oficialmente publicada. A revisão interna chamada v4 está em preparação para a v2. Este guia não registra um novo deploy.',styles['p']))
story.append(Spacer(1,18))
story.append(Paragraph('Como usar',styles['h2']))
for t in ['1. Conferir a fonte, os limites e o ambiente antes de executar.', '2. Coletar transações e estados com a matriz E01-E08.', '3. Redigir usando o roteiro mínimo em inglês e o índice CSV.', '4. Validar coerência com o memorando e revisar o PDF final.']:
 story.append(Paragraph(t,styles['p']))
story.append(Spacer(1,14))
story.append(Paragraph('Arquivos editáveis: guia-deploy-e-evidencias-v2.md · roteiro-minimo-relatorio-onchain-en.md · registro-evidencias-modelo.csv, na pasta docs/entrega/.',styles['small']))
story.append(PageBreak())
lines=source.read_text().splitlines();i=1
while i<len(lines):
 l=lines[i].strip();i+=1
 if not l:continue
 if l.startswith('```'):
  code=[]
  while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
  i+=1;story.append(KeepTogether([Preformatted('\n'.join(code),styles['code'])]));continue
 if l.startswith('## '):story.append(Paragraph(inline(l[3:]),styles['h2']));continue
 if l.startswith('### '):story.append(Paragraph(inline(l[4:]),styles['h3']));continue
 if l.startswith('- '):story.append(Paragraph('• '+inline(l[2:]),styles['li']));continue
 if re.match(r'^\d+\. ',l):story.append(Paragraph(inline(l),styles['li']));continue
 para=[l]
 while i<len(lines) and lines[i].strip() and not re.match(r'^(#|```|- |\d+\. )',lines[i]):para.append(lines[i]);i+=1
 story.append(Paragraph(inline(' '.join(para)),styles['p']))
def footer(c,doc):
 c.saveState();w,h=A4
 c.setStrokeColor(line);c.line(45,43,w-45,43)
 c.setFillColor(muted);c.setFont('Body',8)
 c.drawString(45,29,'IBIToken · Guia de preparação · 25/09/2026')
 c.drawRightString(w-45,29,str(doc.page))
 if doc.page>1:
  c.setFont('Body',8);c.drawString(45,h-30,'DEPLOY E EVIDÊNCIAS / PRÓXIMA ENTREGA OFICIAL V2')
 c.restoreState()
doc=SimpleDocTemplate(str(out),pagesize=A4,rightMargin=45,leftMargin=45,topMargin=55,bottomMargin=60,title='IBIToken — Guia de Deploy e Evidências Operacionais',author='Projeto IBITI Glamping / G01')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(out)
