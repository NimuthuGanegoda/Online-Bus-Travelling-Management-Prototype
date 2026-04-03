from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
CANVAS_BG = "#f5f2ea"
FRAME = "#111111"
TEXT = "#111111"
SUBTEXT = "#404040"
WHITE = "#ffffff"
LINE = "#2f2f2f"
ACCENT_BLUE = "#b9d7ea"
ACCENT_GREEN = "#c8e6c9"
ACCENT_GOLD = "#f2d49b"
ACCENT_RED = "#f0beb5"
ACCENT_PURPLE = "#d9d0f0"


@dataclass
class Box:
    x: int
    y: int
    w: int
    h: int
    title: str
    body: list[str]
    fill: str

    @property
    def cx(self) -> int:
        return self.x + self.w // 2

    @property
    def cy(self) -> int:
        return self.y + self.h // 2


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates.extend(
            [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
            ]
        )
    else:
        candidates.extend(
            [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
            ]
        )

    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


TITLE_FONT = load_font(34, bold=True)
SECTION_FONT = load_font(24, bold=True)
BOX_TITLE_FONT = load_font(20, bold=True)
BODY_FONT = load_font(15)
SMALL_FONT = load_font(13)


def draw_wrapped_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    font: ImageFont.ImageFont,
    fill: str,
    max_width: int,
    line_spacing: int = 5,
) -> int:
    x, y = xy
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        width = draw.textbbox((0, 0), candidate, font=font)[2]
        if width <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    line_height = draw.textbbox((0, 0), "Ag", font=font)[3]
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += line_height + line_spacing
    return y


def draw_box(draw: ImageDraw.ImageDraw, box: Box) -> None:
    draw.rounded_rectangle(
        [(box.x, box.y), (box.x + box.w, box.y + box.h)],
        radius=22,
        outline=FRAME,
        width=3,
        fill=box.fill,
    )
    draw.text((box.x + 20, box.y + 16), box.title, font=BOX_TITLE_FONT, fill=TEXT)
    current_y = box.y + 52
    for line in box.body:
        current_y = draw_wrapped_text(
            draw,
            f"• {line}",
            (box.x + 22, current_y),
            BODY_FONT,
            TEXT,
            box.w - 44,
            line_spacing=4,
        )
        current_y += 6


def draw_arrow(
    draw: ImageDraw.ImageDraw,
    start: tuple[int, int],
    end: tuple[int, int],
    label: str | None = None,
    label_offset: tuple[int, int] = (0, 0),
    width: int = 4,
) -> None:
    sx, sy = start
    ex, ey = end
    draw.line([start, end], fill=LINE, width=width)
    arrow_size = 12
    if abs(ex - sx) >= abs(ey - sy):
        if ex >= sx:
            points = [(ex, ey), (ex - arrow_size, ey - 6), (ex - arrow_size, ey + 6)]
        else:
            points = [(ex, ey), (ex + arrow_size, ey - 6), (ex + arrow_size, ey + 6)]
    else:
        if ey >= sy:
            points = [(ex, ey), (ex - 6, ey - arrow_size), (ex + 6, ey - arrow_size)]
        else:
            points = [(ex, ey), (ex - 6, ey + arrow_size), (ex + 6, ey + arrow_size)]
    draw.polygon(points, fill=LINE)
    if label:
        mid_x = (sx + ex) // 2 + label_offset[0]
        mid_y = (sy + ey) // 2 + label_offset[1]
        bbox = draw.textbbox((0, 0), label, font=SMALL_FONT)
        pad_x = 8
        pad_y = 4
        draw.rounded_rectangle(
            [
                (mid_x - pad_x, mid_y - pad_y),
                (mid_x + (bbox[2] - bbox[0]) + pad_x, mid_y + (bbox[3] - bbox[1]) + pad_y),
            ],
            radius=8,
            fill=WHITE,
            outline=FRAME,
            width=1,
        )
        draw.text((mid_x, mid_y), label, font=SMALL_FONT, fill=SUBTEXT)


def draw_dashed_line(
    draw: ImageDraw.ImageDraw,
    start: tuple[int, int],
    end: tuple[int, int],
    dash: int = 10,
    gap: int = 8,
    width: int = 3,
) -> None:
    sx, sy = start
    ex, ey = end
    length = ((ex - sx) ** 2 + (ey - sy) ** 2) ** 0.5
    if length == 0:
        return
    dx = (ex - sx) / length
    dy = (ey - sy) / length
    distance = 0.0
    while distance < length:
        seg_start = (sx + dx * distance, sy + dy * distance)
        seg_end_dist = min(distance + dash, length)
        seg_end = (sx + dx * seg_end_dist, sy + dy * seg_end_dist)
        draw.line([seg_start, seg_end], fill=LINE, width=width)
        distance += dash + gap


def draw_actor(draw: ImageDraw.ImageDraw, x: int, y: int, label: str) -> None:
    head_r = 24
    draw.ellipse([(x - head_r, y), (x + head_r, y + head_r * 2)], outline=FRAME, width=3, fill=WHITE)
    body_top = y + head_r * 2
    draw.line([(x, body_top), (x, body_top + 70)], fill=FRAME, width=4)
    draw.line([(x - 40, body_top + 20), (x + 40, body_top + 20)], fill=FRAME, width=4)
    draw.line([(x, body_top + 70), (x - 30, body_top + 120)], fill=FRAME, width=4)
    draw.line([(x, body_top + 70), (x + 30, body_top + 120)], fill=FRAME, width=4)
    bbox = draw.textbbox((0, 0), label, font=BOX_TITLE_FONT)
    draw.text((x - (bbox[2] - bbox[0]) // 2, body_top + 132), label, font=BOX_TITLE_FONT, fill=TEXT)


def draw_usecase(
    draw: ImageDraw.ImageDraw,
    center: tuple[int, int],
    size: tuple[int, int],
    label: str,
    fill: str,
) -> None:
    cx, cy = center
    w, h = size
    draw.ellipse([(cx - w // 2, cy - h // 2), (cx + w // 2, cy + h // 2)], outline=FRAME, width=3, fill=fill)
    lines = label.split("\n")
    total_height = len(lines) * 18
    current_y = cy - total_height // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=BODY_FONT)
        draw.text((cx - (bbox[2] - bbox[0]) // 2, current_y), line, font=BODY_FONT, fill=TEXT)
        current_y += 20


def draw_association(draw: ImageDraw.ImageDraw, points: Iterable[tuple[int, int]], dashed: bool = False) -> None:
    pts = list(points)
    if dashed:
        for start, end in zip(pts, pts[1:]):
            draw_dashed_line(draw, start, end)
    else:
        draw.line(pts, fill=LINE, width=3)


def render_system_architecture() -> Image.Image:
    image = Image.new("RGB", (1800, 1200), CANVAS_BG)
    draw = ImageDraw.Draw(image)

    draw.text((60, 42), "Prototype System Architecture Diagram", font=TITLE_FONT, fill=TEXT)
    subtitle = "Online Bus Travelling Management Prototype: architecture derived from the Integration, Sarasi, Amiliya, and Neo prototype packages"
    draw.text((62, 92), subtitle, font=SECTION_FONT, fill=SUBTEXT)

    boxes = [
        Box(70, 220, 360, 250, "Passenger Interfaces", [
            "Flutter passenger client with login and home flow",
            "Sarasi passenger prototype screens for tracking, ETA, alerts, ratings, and history",
            "Passenger journeys request bus location, route, ETA, and complaint data",
        ], ACCENT_BLUE),
        Box(70, 510, 360, 220, "Driver Interfaces", [
            "Flutter driver client with login and registration flow",
            "Sarasi driver prototype screens for trip control, crowd level, NFC, ratings, and SOS",
            "Driver journeys manage active trips and emergency reporting",
        ], ACCENT_GREEN),
        Box(70, 770, 360, 230, "Admin Interface", [
            "React admin dashboard with nested routes and secure login",
            "Live fleet, route management, driver management, bus management, emergencies, and complaints",
            "Operational oversight is wired to Supabase-backed tables and Express APIs",
        ], ACCENT_GOLD),
        Box(530, 190, 360, 280, "Application Backends", [
            "Passenger Express API on port 3001 exposes login, registration, bus-location, bus-route, and ETA placeholders",
            "Driver Express API on port 3000 exposes login plus trip start, trip end, and active trip retrieval",
            "Admin Express API on port 3002 exposes login and CRUD endpoints for buses, drivers, routes, and emergencies",
        ], ACCENT_PURPLE),
        Box(530, 550, 360, 230, "Operational Data Layer", [
            "Supabase is the shared operational store for trips, bus_locations, routes, drivers, buses, reviews, alerts, and SOS requests",
            "Integrated frontends query Supabase directly for live fleet, route maps, complaints, and dashboard tables",
            "Prototype services still preserve lightweight local database scaffolding for earlier phases",
        ], ACCENT_RED),
        Box(1020, 180, 700, 280, "ML Intelligence Layer (Neo)", [
            "ETA engine uses Node.js orchestration, Python inference, and joblib model artifacts trained on trip features",
            "Driver rating engine pulls Supabase comments and classifies sentiment per driver through a Python model",
            "Emergency triage engine ranks emergency incidents through a Node.js to Python scoring pipeline",
        ], "#d7eadf"),
        Box(1020, 560, 700, 230, "Prototype Assets and Training Data", [
            "CSV datasets, trained model binaries, feature encoders, and generated prediction output files",
            "Sarasi visual references and UI image boards capture the target operational workflows",
            "Release artifacts package architecture documentation as PNG, JPG, and PDF exports",
        ], "#efe6cf"),
    ]

    for box in boxes:
        draw_box(draw, box)

    draw_arrow((draw), (430, 345), (530, 345), "REST / JSON")
    draw_arrow((draw), (430, 620), (530, 620), "REST / JSON")
    draw_arrow((draw), (430, 885), (530, 885), "REST / JSON")
    draw_arrow((draw), (890, 330), (1020, 330), "service calls")
    draw_arrow((draw), (710, 470), (710, 550), "read / write", label_offset=(-40, 0))
    draw_arrow((draw), (1370, 460), (1370, 560), "models + datasets", label_offset=(14, 0))
    draw_arrow((draw), (890, 665), (1020, 665), "feature inputs", label_offset=(0, -26))
    draw_arrow((draw), (1020, 735), (890, 735), "predictions / priorities", label_offset=(0, 12))

    footer = (
        "Derived from repo structure under prototypes/Integration, prototypes/Amiliya, "
        "prototypes/Sarasi, and prototypes/Neo."
    )
    draw.text((62, 1128), footer, font=SMALL_FONT, fill=SUBTEXT)
    return image


def render_use_case_diagram() -> Image.Image:
    image = Image.new("RGB", (1900, 1300), CANVAS_BG)
    draw = ImageDraw.Draw(image)

    draw.text((60, 42), "Prototype Use Case Diagram", font=TITLE_FONT, fill=TEXT)
    draw.text((62, 92), "Primary actors and core interactions derived from the prototype screens, APIs, and analytics services", font=SECTION_FONT, fill=SUBTEXT)

    system_box = (360, 180, 1540, 1160)
    draw.rounded_rectangle(system_box, radius=28, outline=FRAME, width=4, fill="#fcfbf7")
    draw.text((390, 205), "Online Bus Travelling Management Prototype", font=SECTION_FONT, fill=TEXT)

    draw_actor(draw, 150, 290, "Passenger")
    draw_actor(draw, 150, 615, "Driver")
    draw_actor(draw, 150, 945, "Admin")
    draw_actor(draw, 1760, 360, "ML Services")
    draw_actor(draw, 1760, 760, "Data Store")

    usecases = {
        "login_passenger": ((560, 320), (220, 90), "Register / Login", ACCENT_BLUE),
        "track_bus": ((840, 300), (230, 90), "Track Bus\nLocation", ACCENT_BLUE),
        "view_eta": ((1120, 300), (220, 90), "View Bus ETA", ACCENT_GREEN),
        "view_route": ((1380, 300), (230, 90), "View Active\nRoute", ACCENT_BLUE),
        "history": ((730, 470), (250, 90), "Review Trip\nHistory", ACCENT_GOLD),
        "rate_bus": ((1030, 470), (240, 90), "Submit Rating /\nComplaint", ACCENT_GOLD),
        "raise_alert": ((1330, 470), (250, 90), "Raise Passenger\nEmergency Alert", ACCENT_RED),
        "login_driver": ((560, 665), (220, 90), "Driver Login", ACCENT_GREEN),
        "manage_trip": ((860, 650), (250, 90), "Start / End\nTrip", ACCENT_GREEN),
        "crowd": ((1135, 650), (240, 90), "Update Crowd /\nTrip Status", ACCENT_GREEN),
        "driver_alert": ((1405, 650), (250, 90), "Respond to / Report\nSOS Incident", ACCENT_RED),
        "login_admin": ((560, 960), (220, 90), "Admin Login", ACCENT_GOLD),
        "fleet": ((840, 930), (250, 90), "Monitor Live\nFleet", ACCENT_GOLD),
        "routes": ((1110, 930), (240, 90), "Manage Routes", ACCENT_GOLD),
        "drivers": ((1360, 930), (240, 90), "Manage Drivers /\nBuses", ACCENT_GOLD),
        "emergency": ((980, 1085), (280, 95), "Review and Prioritize\nEmergency Incidents", ACCENT_RED),
    }

    for center, size, label, fill in usecases.values():
        draw_usecase(draw, center, size, label, fill)

    passenger_links = [
        [(190, 450), (290, 450), (290, 320), (450, 320)],
        [(190, 450), (315, 450), (315, 300), (725, 300)],
        [(190, 450), (340, 450), (340, 280), (1010, 280)],
        [(190, 450), (365, 450), (365, 260), (1265, 260)],
        [(190, 450), (300, 450), (300, 470), (610, 470)],
        [(190, 450), (325, 450), (325, 490), (910, 490)],
        [(190, 450), (350, 450), (350, 510), (1205, 510)],
    ]
    for points in passenger_links:
        draw_association(draw, points)

    driver_links = [
        [(190, 770), (300, 770), (300, 665), (450, 665)],
        [(190, 770), (325, 770), (325, 650), (735, 650)],
        [(190, 770), (350, 770), (350, 680), (1015, 680)],
        [(190, 770), (375, 770), (375, 710), (1280, 710)],
    ]
    for points in driver_links:
        draw_association(draw, points)

    admin_links = [
        [(190, 1100), (300, 1100), (300, 960), (450, 960)],
        [(190, 1100), (325, 1100), (325, 930), (715, 930)],
        [(190, 1100), (350, 1100), (350, 905), (990, 905)],
        [(190, 1100), (375, 1100), (375, 880), (1240, 880)],
        [(190, 1100), (400, 1100), (400, 1085), (820, 1085)],
    ]
    for points in admin_links:
        draw_association(draw, points)

    draw_association(draw, [(1585, 360), (1490, 470), (1440, 470)])
    draw_association(draw, [(1585, 360), (1260, 1085), (1120, 1085)], dashed=True)
    draw_association(draw, [(1585, 760), (1480, 300), (1495, 300)])
    draw_association(draw, [(1585, 760), (1475, 650), (1530, 650)])
    draw_association(draw, [(1585, 760), (1435, 930), (1480, 930)])

    note = "Dashed association shows ML support for ETA prediction and emergency prioritization; direct links show operational data access."
    draw.text((392, 1200), note, font=SMALL_FONT, fill=SUBTEXT)
    return image


def save_outputs(image: Image.Image, stem: str) -> None:
    png_path = ROOT / f"{stem}.png"
    jpg_path = ROOT / f"{stem}.jpg"
    pdf_path = ROOT / f"{stem}.pdf"
    image.save(png_path, "PNG")
    image.save(jpg_path, "JPEG", quality=95)
    image.save(pdf_path, "PDF", resolution=150.0)


def main() -> None:
    save_outputs(render_system_architecture(), "prototype-system-architecture-diagram")
    save_outputs(render_use_case_diagram(), "prototype-use-case-diagram")
    print("Generated diagram assets in", ROOT)


if __name__ == "__main__":
    main()
