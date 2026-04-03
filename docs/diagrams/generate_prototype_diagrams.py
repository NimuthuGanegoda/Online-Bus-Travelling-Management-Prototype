from __future__ import annotations

from pathlib import Path
from subprocess import run

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent

ARCH_DOT = r"""
digraph PrototypeArchitecture {
  graph [
    rankdir=LR,
    splines=ortho,
    nodesep=0.55,
    ranksep=0.9,
    pad=0.35,
    bgcolor="#fcfaf5",
    fontname="Helvetica",
    label="Prototype System Architecture Diagram\nOnline Bus Travelling Management Prototype derived from Integration, Sarasi, Amiliya, and Neo modules",
    labelloc=t,
    fontsize=24,
    fontcolor="#1f2937"
  ];

  node [
    shape=box,
    style="rounded,filled",
    color="#243447",
    penwidth=1.4,
    fontname="Helvetica",
    fontsize=12,
    margin="0.14,0.10"
  ];

  edge [
    color="#5b6574",
    penwidth=1.3,
    arrowsize=0.8,
    fontname="Helvetica",
    fontsize=10
  ];

  subgraph cluster_experience {
    label="Experience Layer";
    color="#b8cbe0";
    style="rounded,filled";
    fillcolor="#eef5fb";
    fontcolor="#1f2937";
    fontsize=16;

    passenger_ui [
      fillcolor="#d9ebfb",
      label="Passenger Apps\n- Integration Flutter client\n- Sarasi passenger prototype\n- Tracking, ETA, history, alerts, ratings"
    ];
    driver_ui [
      fillcolor="#ddf1de",
      label="Driver Apps\n- Integration Flutter client\n- Sarasi driver prototype\n- Trip control, crowd updates, SOS, NFC-oriented flows"
    ];
    admin_ui [
      fillcolor="#f7e7bf",
      label="Admin Dashboard\n- React admin console\n- Live fleet, routes, drivers, buses\n- Emergency handling and complaints"
    ];
  }

  subgraph cluster_services {
    label="Platform Services";
    color="#c9bfd9";
    style="rounded,filled";
    fillcolor="#f4eefb";
    fontcolor="#1f2937";
    fontsize=16;

    passenger_api [
      fillcolor="#ede3fb",
      label="Passenger API :3001\nExpress routes for login, register,\nbus location, route lookup, and ETA endpoint stub"
    ];
    driver_api [
      fillcolor="#ede3fb",
      label="Driver API :3000\nExpress routes for login,\nactive trip, trip start, and trip end"
    ];
    admin_api [
      fillcolor="#ede3fb",
      label="Admin API :3002\nExpress login plus CRUD for\nbuses, drivers, routes, and emergencies"
    ];
    supabase [
      fillcolor="#f9d9d2",
      label="Supabase Operational Data\nTrips, bus locations, routes, buses,\ndrivers, reviews, alerts, SOS requests"
    ];
  }

  subgraph cluster_intelligence {
    label="Analytics and Intelligence";
    color="#b8d8c2";
    style="rounded,filled";
    fillcolor="#edf8ef";
    fontcolor="#1f2937";
    fontsize=16;

    eta [
      fillcolor="#dff2e6",
      label="ETA Service\nNode.js orchestration + Python model\npredicts bus arrival time from trip features"
    ];
    rating [
      fillcolor="#dff2e6",
      label="Driver Rating Service\nSupabase comments + Python classifier\naggregates per-driver rating signals"
    ];
    triage [
      fillcolor="#dff2e6",
      label="Emergency Triage Service\nNode.js pipeline + Python ranking model\nprioritizes incident severity"
    ];
  }

  subgraph cluster_assets {
    label="Prototype Inputs and Assets";
    color="#e1d2a9";
    style="rounded,filled";
    fillcolor="#fbf6e7";
    fontcolor="#1f2937";
    fontsize=16;

    assets [
      fillcolor="#fff7de",
      label="Source Artifacts\n- Sarasi UI references and screen boards\n- Neo CSV datasets, encoders, trained models\n- Generated documentation diagrams for Releases"
    ];
  }

  passenger_ui -> passenger_api;
  driver_ui -> driver_api;
  admin_ui -> admin_api;
  admin_ui -> supabase [style=dashed];

  passenger_api -> supabase;
  driver_api -> supabase;
  admin_api -> supabase;

  passenger_api -> eta;
  passenger_api -> rating;
  admin_api -> triage;
  driver_api -> triage [style=dashed];

  assets -> eta;
  assets -> rating;
  assets -> triage;
  assets -> passenger_ui [style=dashed];
  assets -> driver_ui [style=dashed];
  assets -> admin_ui [style=dashed];
}
"""

BG = "#fcfaf5"
FRAME = "#334155"
TEXT = "#1f2937"
SUBTEXT = "#475569"
PASSENGER = "#d9ebfb"
DRIVER = "#ddf1de"
ADMIN = "#f7e7bf"
ALERT = "#f9d9d2"
SUPPORT = "#dff2e6"


def load_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
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


TITLE_FONT = load_font(40, bold=True)
SUBTITLE_FONT = load_font(24)
SECTION_FONT = load_font(24, bold=True)
BODY_FONT = load_font(20)
SMALL_FONT = load_font(16)


def render_dot(dot_source: str, stem: str) -> Path:
    dot_path = ROOT / f"{stem}.dot"
    svg_path = ROOT / f"{stem}.svg"
    png_path = ROOT / f"{stem}.png"
    pdf_path = ROOT / f"{stem}.pdf"
    jpg_path = ROOT / f"{stem}.jpg"

    dot_path.write_text(dot_source.strip() + "\n", encoding="utf-8")

    run(["dot", "-Tpng", str(dot_path), "-o", str(png_path)], check=True)
    run(["dot", "-Tpdf", str(dot_path), "-o", str(pdf_path)], check=True)

    image = Image.open(png_path).convert("RGB")
    image.save(jpg_path, "JPEG", quality=95)

    svg_path.unlink(missing_ok=True)
    return dot_path


def draw_centered(draw: ImageDraw.ImageDraw, text: str, center: tuple[int, int], font: ImageFont.ImageFont, fill: str) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    x = center[0] - (bbox[2] - bbox[0]) // 2
    y = center[1] - (bbox[3] - bbox[1]) // 2
    draw.text((x, y), text, font=font, fill=fill)


def draw_pill(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, fill: str) -> None:
    draw.rounded_rectangle(box, radius=28, fill=fill, outline=FRAME, width=3)
    draw_centered(draw, text, ((box[0] + box[2]) // 2, (box[1] + box[3]) // 2), BODY_FONT, TEXT)


def draw_box(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], text: str, fill: str, radius: int = 20) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=FRAME, width=3)
    draw_centered(draw, text, ((box[0] + box[2]) // 2, (box[1] + box[3]) // 2), BODY_FONT, TEXT)


def draw_actor_link(draw: ImageDraw.ImageDraw, actor_box: tuple[int, int, int, int], lane_x: int, targets: list[tuple[int, int]]) -> None:
    start_x = actor_box[2]
    start_y = (actor_box[1] + actor_box[3]) // 2
    draw.line((start_x, start_y, lane_x, start_y), fill="#94a3b8", width=3)
    if targets:
        top = min(y for _, y in targets)
        bottom = max(y for _, y in targets)
        draw.line((lane_x, top, lane_x, bottom), fill="#94a3b8", width=3)
    for target_x, target_y in targets:
        draw.line((lane_x, target_y, target_x, target_y), fill="#94a3b8", width=3)


def draw_dashed(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int]) -> None:
    sx, sy = start
    ex, ey = end
    if sx == ex:
        step = 14 if ey >= sy else -14
        for y in range(sy, ey, step * 2):
            y2 = min(y + step, ey) if step > 0 else max(y + step, ey)
            draw.line((sx, y, ex, y2), fill="#94a3b8", width=3)
    else:
        step = 14 if ex >= sx else -14
        for x in range(sx, ex, step * 2):
            x2 = min(x + step, ex) if step > 0 else max(x + step, ex)
            draw.line((x, sy, x2, ey), fill="#94a3b8", width=3)


def render_use_case_diagram() -> None:
    image = Image.new("RGB", (2200, 1400), BG)
    draw = ImageDraw.Draw(image)

    draw_centered(draw, "Prototype Use Case Diagram", (1100, 60), TITLE_FONT, TEXT)
    draw_centered(
        draw,
        "Primary actors and core interactions derived from prototype screens, APIs, and analytics services",
        (1100, 115),
        SUBTITLE_FONT,
        SUBTEXT,
    )

    boundary = (260, 180, 1940, 1280)
    draw.rounded_rectangle(boundary, radius=32, outline="#d6cfc2", width=3, fill="#fffdf8")
    draw.text((300, 205), "Online Bus Travelling Management Prototype", font=SECTION_FONT, fill=TEXT)

    lanes = [
        ((310, 280, 1890, 540), "Passenger Flows", "#eef5fb"),
        ((310, 580, 1890, 810), "Driver Flows", "#edf8ef"),
        ((310, 850, 1890, 1210), "Admin Flows", "#fbf6e7"),
    ]
    for box, label, fill in lanes:
        draw.rounded_rectangle(box, radius=28, outline="#d8dee8", width=2, fill=fill)
        draw.text((box[0] + 24, box[1] + 18), label, font=SECTION_FONT, fill=TEXT)

    passenger_box = (60, 360, 200, 430)
    driver_box = (60, 655, 200, 725)
    admin_box = (60, 1010, 200, 1080)
    ml_box = (1975, 355, 2140, 430)
    store_box = (1950, 930, 2165, 1005)

    draw_box(draw, passenger_box, "Passenger", PASSENGER)
    draw_box(draw, driver_box, "Driver", DRIVER)
    draw_box(draw, admin_box, "Admin", ADMIN)
    draw_box(draw, ml_box, "ML Services", SUPPORT)
    draw_box(draw, store_box, "Operational Data Store", ALERT)

    passenger_nodes = [
        ((430, 350, 700, 420), "Register / Login", PASSENGER),
        ((770, 350, 1080, 420), "Track Bus Location", PASSENGER),
        ((1150, 350, 1380, 420), "View Bus ETA", SUPPORT),
        ((1450, 350, 1730, 420), "View Active Route", PASSENGER),
        ((520, 455, 820, 525), "Review Trip History", ADMIN),
        ((930, 455, 1270, 525), "Submit Rating / Complaint", ADMIN),
        ((1380, 455, 1765, 525), "Raise Emergency Alert", ALERT),
    ]

    driver_nodes = [
        ((520, 645, 790, 715), "Driver Login", DRIVER),
        ((870, 645, 1130, 715), "Start / End Trip", DRIVER),
        ((1210, 645, 1585, 715), "Update Crowd / Trip Status", DRIVER),
        ((1660, 645, 1845, 715), "Report SOS", ALERT),
    ]

    admin_nodes = [
        ((430, 950, 660, 1020), "Admin Login", ADMIN),
        ((740, 950, 1030, 1020), "Monitor Live Fleet", ADMIN),
        ((1110, 950, 1360, 1020), "Manage Routes", ADMIN),
        ((1440, 950, 1775, 1020), "Manage Drivers / Buses", ADMIN),
        ((600, 1080, 970, 1150), "Review Complaints", ADMIN),
        ((1080, 1080, 1490, 1150), "Prioritize Emergencies", ALERT),
    ]

    for box, label, fill in passenger_nodes + driver_nodes + admin_nodes:
        draw_pill(draw, box, label, fill)

    draw_actor_link(draw, passenger_box, 245, [(box[0], (box[1] + box[3]) // 2) for box, _, _ in passenger_nodes])
    draw_actor_link(draw, driver_box, 245, [(box[0], (box[1] + box[3]) // 2) for box, _, _ in driver_nodes])
    draw_actor_link(draw, admin_box, 245, [(box[0], (box[1] + box[3]) // 2) for box, _, _ in admin_nodes])

    ml_anchor = (ml_box[0], (ml_box[1] + ml_box[3]) // 2)
    for target_box in [passenger_nodes[2][0], passenger_nodes[5][0], admin_nodes[5][0]]:
        target = (target_box[2], (target_box[1] + target_box[3]) // 2)
        draw_dashed(draw, (target[0] + 20, target[1]), (ml_anchor[0], target[1]))
        draw_dashed(draw, (ml_anchor[0], target[1]), ml_anchor)

    store_anchor = (store_box[0], (store_box[1] + store_box[3]) // 2)
    for target_box in [passenger_nodes[1][0], passenger_nodes[3][0], driver_nodes[1][0], admin_nodes[1][0], admin_nodes[3][0], admin_nodes[4][0]]:
        target = (target_box[2], (target_box[1] + target_box[3]) // 2)
        draw_dashed(draw, (target[0] + 20, target[1]), (store_anchor[0], target[1]))
        draw_dashed(draw, (store_anchor[0], target[1]), store_anchor)

    note = "Dashed links show analytics or shared operational data supporting the primary use cases."
    draw.text((320, 1235), note, font=SMALL_FONT, fill=SUBTEXT)

    png_path = ROOT / "prototype-use-case-diagram.png"
    pdf_path = ROOT / "prototype-use-case-diagram.pdf"
    jpg_path = ROOT / "prototype-use-case-diagram.jpg"
    svg_path = ROOT / "prototype-use-case-diagram.svg"

    image.save(png_path, "PNG")
    image.save(pdf_path, "PDF", resolution=160.0)
    image.save(jpg_path, "JPEG", quality=95)
    if svg_path.exists():
        svg_path.unlink()


def main() -> None:
    temp_files = [render_dot(ARCH_DOT, "prototype-system-architecture-diagram")]
    for temp_file in temp_files:
        temp_file.unlink(missing_ok=True)
    render_use_case_diagram()
    print("Generated Graphviz diagram assets in", ROOT)


if __name__ == "__main__":
    main()
