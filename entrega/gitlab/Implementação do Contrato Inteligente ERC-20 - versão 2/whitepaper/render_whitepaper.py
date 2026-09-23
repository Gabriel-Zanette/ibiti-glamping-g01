"""Render the editable IBITI whitepaper to a paginated PDF."""
from pathlib import Path
import re
import html
import math
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak,
    CondPageBreak, Table, TableStyle, Flowable, KeepTogether
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "whitepaper/whitepaper_ibiti_revisado.md"
OUTPUT = ROOT / "output/pdf/whitepaper_ibiti_revisado.pdf"
FONTDIR = Path("/System/Library/Fonts/Supplemental")
for key, name in [
    ("Body", "Arial.ttf"), ("BodyBold", "Arial Bold.ttf"),
    ("BodyItalic", "Arial Italic.ttf"), ("BodyBoldItalic", "Arial Bold Italic.ttf"),
    ("Display", "Georgia.ttf"), ("Mono", "Courier New.ttf")
]:
    pdfmetrics.registerFont(TTFont(key, str(FONTDIR / name)))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="BodyBold",
                             italic="BodyItalic", boldItalic="BodyBoldItalic")
GREEN = colors.HexColor("#234B3B")
INK = colors.HexColor("#20312B")
MUTED = colors.HexColor("#63726B")
PALE = colors.HexColor("#EDF3EE")
RULE = colors.HexColor("#D1DDD3")
GOLD = colors.HexColor("#B59663")
WIDTH, HEIGHT = A4
MARGIN = 54
CW = WIDTH - 2*MARGIN
styles = {
    "body": ParagraphStyle("body", fontName="Body", fontSize=10.2, leading=15.1,
                           textColor=INK, spaceAfter=8.2, splitLongWords=True,
                           allowWidows=0, allowOrphans=0),
    "small": ParagraphStyle("small", fontName="Body", fontSize=8.7, leading=12.3,
                            textColor=MUTED, spaceAfter=7),
    "h1": ParagraphStyle("h1", fontName="Display", fontSize=22, leading=27,
                         textColor=GREEN, spaceBefore=10, spaceAfter=14, keepWithNext=True),
    "h2": ParagraphStyle("h2", fontName="BodyBold", fontSize=12.4, leading=16.5,
                         textColor=GREEN, spaceBefore=15, spaceAfter=8, keepWithNext=True),
    "cell": ParagraphStyle("cell", fontName="Body", fontSize=8.65, leading=12.1,
                           textColor=INK, splitLongWords=True),
    "thead": ParagraphStyle("thead", fontName="BodyBold", fontSize=8.65, leading=12.1,
                            textColor=colors.white),
    "bullet": ParagraphStyle("bullet", fontName="Body", fontSize=9.5, leading=13.6,
                             textColor=INK, leftIndent=10, firstLineIndent=-10,
                             spaceAfter=5),
    "decision": ParagraphStyle("decision", fontName="Body", fontSize=10.1, leading=15,
                               textColor=GREEN, borderColor=RULE, borderWidth=.6,
                               borderPadding=10, backColor=PALE,
                               spaceBefore=8, spaceAfter=14),
    "cover_title": ParagraphStyle("cover_title", fontName="Display", fontSize=42,
                                  leading=48, textColor=GREEN),
    "cover_sub": ParagraphStyle("cover_sub", fontName="Body", fontSize=18, leading=25,
                                textColor=INK, spaceBefore=18),
    "label": ParagraphStyle("label", fontName="BodyBold", fontSize=9, leading=13,
                            textColor=MUTED, spaceAfter=10)
}

def clean(text):
    for char in "\u2010\u2011\u2012\u2013\u2014\u2212":
        text = text.replace(char, "-")
    return text

def inline(text):
    text = html.escape(clean(text))
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    def url_link(m):
        url = m.group(0)
        return '<link href="' + url + '" color="#234B3B">' + url + "</link>"
    text = re.sub(r"https?://[^\s<>]+", url_link, text)
    return text

def para(text, style="body"):
    return Paragraph(inline(text), styles[style])

class Diagram(Flowable):
    def __init__(self, kind):
        Flowable.__init__(self)
        self.kind = kind
        self.width = CW
        self.height = 310 if kind=="architecture" else 177

    def draw(self):
        c = self.canv
        c.setFillColor(PALE)
        c.roundRect(0, 0, self.width, self.height, 7, fill=1, stroke=0)
        def box(x,y,w,h,title,sub=""):
            c.setFillColor(colors.white); c.setStrokeColor(RULE)
            c.roundRect(x,y,w,h,5,fill=1,stroke=1)
            p=Paragraph(inline(title), ParagraphStyle("box",fontName="BodyBold",
                          fontSize=9.5,leading=12,textColor=GREEN))
            _,ph=p.wrap(w-16,h)
            p.drawOn(c,x+8,y+h-ph-9)
            if sub:
                q=Paragraph(inline(sub),ParagraphStyle("boxsub",fontName="Body",
                            fontSize=8,leading=10.5,textColor=MUTED))
                _,qh=q.wrap(w-16,h)
                q.drawOn(c,x+8,y+8)
        def arrow(x1,y1,x2,y2,label="",lx=None,ly=None):
            c.setStrokeColor(MUTED); c.setFillColor(MUTED); c.setLineWidth(.85)
            c.line(x1,y1,x2,y2)
            a=math.atan2(y2-y1,x2-x1)
            p=c.beginPath(); p.moveTo(x2,y2)
            p.lineTo(x2-5*math.cos(a-.5),y2-5*math.sin(a-.5))
            p.lineTo(x2-5*math.cos(a+.5),y2-5*math.sin(a+.5))
            p.close(); c.drawPath(p,fill=1,stroke=0)
            if label:
                c.setFont("Body",7.6)
                c.drawString(lx if lx is not None else (x1+x2)/2+5,
                             ly if ly is not None else (y1+y2)/2+3,label)
        if self.kind=="architecture":
            box(18,244,215,50,"Pessoa e carteira","Assinatura e solicitação")
            box(18,155,215,56,"Aplicação e livro de cotas","Identidade, vínculos, pedidos e histórico")
            box(270,155,199,56,"Hospitalidade","Inventário e prestação da experiência")
            box(18,66,215,56,"Ethereum / IBIToken","Propriedade, circulação e royalties")
            box(270,66,199,56,"Administrador e prestador","Apuração, BRL / BRZ e financiamento")
            arrow(126,244,126,211,"autenticar / solicitar",133,227)
            arrow(233,183,270,183)
            arrow(126,155,126,122,"conciliar eventos",133,137)
            arrow(270,94,233,94)
            c.setFont("Body",8); c.setFillColor(MUTED)
            c.drawString(18,27,"Blockchain: posições e pagamentos. Backend: pessoas e experiências.")
        else:
            box(16,112,113,48,"Livre","Disponível no livro")
            box(187,112,113,48,"Reservada","Solicitada / confirmada")
            box(358,112,113,48,"Utilizada","Experiência concluída")
            box(187,20,150,48,"Devolução pendente","Aguarda conciliação")
            arrow(129,136,187,136,"solicitar",137,145)
            arrow(300,136,358,136,"concluir",308,145)
            arrow(243,112,243,68,"cancelar",250,85)
            c.setStrokeColor(MUTED)
            c.line(187,44,72,44)
            arrow(72,44,72,112)
            c.setFont("Body",7.5); c.setFillColor(MUTED)
            c.drawString(20,28,"conciliar e devolver")

class IBITIDoc(BaseDocTemplate):
    def __init__(self, output):
        super().__init__(str(output), pagesize=A4,
                         rightMargin=MARGIN, leftMargin=MARGIN,
                         topMargin=62, bottomMargin=54,
                         title="Whitepaper IBITI - IBIToken",
                         author="Projeto IBITI Glamping",
                         subject="Funcionamento, direitos e premissas do IBIToken - setembro de 2026")
        frame=Frame(MARGIN,54,CW,HEIGHT-116,id="body",leftPadding=0,
                    rightPadding=0,topPadding=0,bottomPadding=0)
        self.addPageTemplates(PageTemplate(id="all",frames=frame,onPage=self.page))
        self.headings=[]
    def page(self,c,doc):
        c.saveState()
        if doc.page==1:
            c.setFillColor(PALE); c.rect(0,HEIGHT-18,WIDTH,18,fill=1,stroke=0)
            c.setFillColor(GOLD); c.rect(MARGIN,HEIGHT-82,36,3,fill=1,stroke=0)
        else:
            c.setFont("BodyBold",8.1); c.setFillColor(GREEN)
            c.drawString(MARGIN,HEIGHT-32,"IBITI  /  WHITEPAPER")
            c.setFont("Body",7.6); c.setFillColor(MUTED)
            c.drawRightString(WIDTH-MARGIN,HEIGHT-32,"IBITOKEN V3  |  SETEMBRO 2026")
            c.setStrokeColor(RULE); c.line(MARGIN,HEIGHT-42,WIDTH-MARGIN,HEIGHT-42)
        c.setStrokeColor(RULE); c.line(MARGIN,40,WIDTH-MARGIN,40)
        c.setFont("Body",7.5); c.setFillColor(MUTED)
        c.drawString(MARGIN,27,"IBITI Glamping  |  Projeto acadêmico")
        c.drawRightString(WIDTH-MARGIN,27,str(doc.page))
        c.restoreState()
    def afterFlowable(self,flowable):
        if getattr(flowable,"toc_heading",False):
            text=flowable.getPlainText()
            key="section-"+str(flowable.section_index)
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(text,key,level=0,closed=False)
            self.notify("TOCEntry",(0,text,self.page,key))
            self.headings.append((self.page,text))

def make_table(lines):
    rows=[[x.strip() for x in row.strip().strip("|").split("|")] for row in lines]
    rows=[r for r in rows if not all(re.fullmatch(r":?-+:?",x.replace(" ","")) for x in r)]
    n=len(rows[0])
    if n==2: weights=[.28,.72]
    elif n==3: weights=[.25,.32,.43]
    elif n==4: weights=[.16,.25,.31,.28]
    else: weights=[.28]+[(.72/(n-1))]*(n-1)
    if rows[0][0]=="Ano": weights=[.10,.20,.35,.35]
    if "cenário" in rows[0][0].lower(): weights=[.49,.28,.23]
    data=[[para(cell,"thead" if i==0 else "cell") for cell in r] for i,r in enumerate(rows)]
    t=Table(data,colWidths=[CW*w for w in weights],repeatRows=1,hAlign="LEFT",
            rowSplitRange=(2,len(data)-2) if len(data)>4 else None)
    commands=[
        ("BACKGROUND",(0,0),(-1,0),GREEN),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("LEFTPADDING",(0,0),(-1,-1),8),
        ("RIGHTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),7),
        ("BOTTOMPADDING",(0,0),(-1,-1),7),
        ("LINEBELOW",(0,0),(-1,0),.6,GREEN),
    ]
    for r in range(1,len(data)):
        if r%2==1: commands.append(("BACKGROUND",(0,r),(-1,r),PALE))
        commands.append(("LINEBELOW",(0,r),(-1,r),.35,RULE))
    t.setStyle(TableStyle(commands))
    return t

def render():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    (ROOT / "tmp/pdfs/whitepaper").mkdir(parents=True, exist_ok=True)
    text=SOURCE.read_text()
    main=text[text.index("# 1. Sumário executivo"):]
    story=[]
    story += [Spacer(1,72),para("IBITI GLAMPING  /  IBITOKEN","label"),
              para("Whitepaper<br/>IBITI".replace("<br/>","\n"),"cover_title")]
    story[-1]=Paragraph("Whitepaper<br/>IBITI",styles["cover_title"])
    story += [para("Passaporte, experiências<br/>e participação em royalties".replace("<br/>"," "),"cover_sub"),
              Spacer(1,36),
              para("Edição revisada em 22/09/2026 | IBIToken v3","body"),
              Spacer(1,21),
              para("150 IBT. Participação em royalties e acesso a experiências, com propriedade registrada na blockchain e atendimento por pessoa verificada.","decision"),
              Spacer(1,20),
              para("Finalidade, direitos, regras econômicas, governança e funcionamento tecnológico do token.","body"),
              Spacer(1,22),
              para("Documento de referência do projeto acadêmico IBITI Glamping. Implementação de referência na rede de testes Sepolia. Condições de operação no capítulo 13.","small"),
              PageBreak(),
              para("Sumário","h1"),
              para("Finalidade e direitos; emissão e royalties; experiências e governança; arquitetura tecnológica; riscos e condições de operação. Apêndices com glossário, memória de cálculo, identificação técnica e referências.","body")]
    toc=TableOfContents()
    toc.levelStyles=[ParagraphStyle("toc",fontName="Body",fontSize=10.1,
                      leading=14.5,textColor=GREEN,spaceBefore=6,leftIndent=0,
                      firstLineIndent=0,rightIndent=20)]
    story += [Spacer(1,8),toc,Spacer(1,18),
              para("Este whitepaper explica o programa e sua implementação de referência. Não substitui o memorando da oferta, os instrumentos jurídicos ou o regulamento de hospedagem.","small"),PageBreak()]
    lines=main.splitlines()
    i=0; heading_count=0
    while i<len(lines):
        line=lines[i].strip()
        if not line:
            i+=1;continue
        if line.startswith("# "):
            heading_count+=1
            if heading_count>1:
                if line.startswith("# Apêndice"):
                    story.append(PageBreak())
                else:
                    story.append(CondPageBreak(205))
            h=para(line[2:],"h1");h.toc_heading=True;h.section_index=heading_count
            story.append(h);i+=1
        elif line.startswith("## "):
            story.append(para(line[3:],"h2"));i+=1
        elif line.startswith("|"):
            group=[]
            while i<len(lines) and lines[i].strip().startswith("|"):
                group.append(lines[i].strip());i+=1
            story.extend([make_table(group),Spacer(1,10)])
        elif line.startswith("~~~"):
            kind=line[3:]; group=[];i+=1
            while i<len(lines) and not lines[i].startswith("~~~"):
                group.append(lines[i]);i+=1
            i+=1
            if kind in ("architecture","states"):
                story.extend([Diagram(kind),Spacer(1,14)])
            else:
                body="<br/>".join(html.escape(x).replace(" ","&#160;") for x in group)
                s=ParagraphStyle("code",fontName="Mono",fontSize=8.15,leading=13,
                                 textColor=GREEN,backColor=PALE,borderPadding=10,
                                 spaceBefore=6,spaceAfter=15)
                story.append(Paragraph(body,s))
        elif line.startswith("- "):
            story.append(para("• "+line[2:],"bullet"));i+=1
        else:
            group=[line];i+=1
            while i<len(lines) and lines[i].strip() and not lines[i].startswith(("#","|","~~~","- ")):
                group.append(lines[i].strip());i+=1
            t=" ".join(group)
            story.append(para(t,"decision" if t.startswith("**Decisão D") else "body"))
    doc=IBITIDoc(OUTPUT)
    doc.multiBuild(story)
    print(OUTPUT)
    print("Pages:",doc.page)
    (ROOT/"tmp/pdfs/whitepaper/section_pages.txt").write_text(
        "\n".join(f"{p}: {t}" for p,t in doc.headings[-heading_count:]))
if __name__=="__main__":
    render()
