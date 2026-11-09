const map = document.getElementById("tank_map");

let p1_color = "#00abff";
let p2_color = "#ab00ff";
let p3_color = "#00ffab";
let p4_color = "#ffab00";

function Get_Colliding_Element(element, x, y, selector, ignored_element = null) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    return Array.from(map.querySelectorAll(selector)).find((other) => {
        if (other === ignored_element) return false;

        return x < other.offsetLeft + other.offsetWidth &&
            x + width > other.offsetLeft &&
            y < other.offsetTop + other.offsetHeight &&
            y + height > other.offsetTop;
    }) ?? null;
}

class Tank {
    constructor(name, color, x, y, rotation) {
        const tank = document.createElement("div");
        tank.className = "tank";
        const tank_body = document.createElement("div");
        tank_body.className = "tank_body";
        tank_body.style.backgroundColor = color;
        const tank_turret = document.createElement("div");
        tank_turret.className = "tank_turret";
        tank_turret.style.backgroundColor = color;
        tank.append(tank_body, tank_turret);

        this.name = name;
        this.health = 100;
        this.power = 10;
        this.color = color;
        this.size = 5;
        this.move_speed = 100;
        this.rotation_speed = 100;
        this.active_bullets = 0;
        this.bullet_speed = .2;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.container = tank;
        this.body = tank_body;
        this.turret = tank_turret;
        this.body.tank = this;

        map.appendChild(tank);
    }

    draw() {
        this.body.style.top = `${this.y}px`;
        this.body.style.left = `${this.x}px`;
        this.turret.style.top = `${this.y + this.size * 1.5}px`;
        this.turret.style.left = `${this.x + this.size}px`;

        this.turret.style.rotate = this.rotation + "deg";
    }

    move(pressed_keys, controls, delta_time) {
        const horizontal =
            Number(controls.right.some((key) => pressed_keys.has(key))) -
            Number(controls.left.some((key) => pressed_keys.has(key)));
        const vertical =
            Number(controls.down.some((key) => pressed_keys.has(key))) -
            Number(controls.up.some((key) => pressed_keys.has(key)));
        const direction_length = Math.hypot(horizontal, vertical) || 1;
        const distance = this.move_speed * delta_time / 1000 / direction_length;

        const next_x = Math.max(
            0,
            Math.min(this.x + horizontal * distance, map.clientWidth - this.body.offsetWidth)
        );
        if (!Get_Colliding_Element(this.body, next_x, this.y, ".wall")) {
            this.x = next_x;
        }

        const next_y = Math.max(
            0,
            Math.min(this.y + vertical * distance, map.clientHeight - this.body.offsetHeight)
        );
        if (!Get_Colliding_Element(this.body, this.x, next_y, ".wall")) {
            this.y = next_y;
        }

        this.rotation += (
            Number(controls.rotate_right.some((key) => pressed_keys.has(key))) -
            Number(controls.rotate_left.some((key) => pressed_keys.has(key)))
        ) * this.rotation_speed * delta_time / 1000;
        this.rotation = (this.rotation % 360 + 360) % 360;

        this.draw();
    }

    shoot() {
        if (this.active_bullets > 2) return;

        const bullet = document.createElement("span");
        bullet.className = "tank_bullet";
        bullet.style.backgroundColor = this.color;
        map.appendChild(bullet);
        this.active_bullets += 1;

        const angle = this.rotation * Math.PI / 180;
        const direction_x = -Math.sin(angle);
        const direction_y = Math.cos(angle);
        const turret_left = parseFloat(this.turret.style.left);
        const turret_top = parseFloat(this.turret.style.top);
        const bullet_x = turret_left + this.turret.offsetWidth / 2
            + direction_x * this.turret.offsetHeight - bullet.offsetWidth / 2;
        const bullet_y = turret_top
            + direction_y * this.turret.offsetHeight - bullet.offsetHeight / 2;
        let previous_time;

        const move_bullet = (time) => {
            let x = bullet_x;
            let y = bullet_y;

            if (previous_time !== undefined) {
                const distance = this.bullet_speed * (time - previous_time);
                x = parseFloat(bullet.style.left) + direction_x * distance;
                y = parseFloat(bullet.style.top) + direction_y * distance;
            }

            const start_x = parseFloat(bullet.style.left || bullet_x);
            const start_y = parseFloat(bullet.style.top || bullet_y);
            const distance_x = x - start_x;
            const distance_y = y - start_y;
            const steps = Math.max(1, Math.ceil(Math.max(Math.abs(distance_x), Math.abs(distance_y))));

            for (let step = 1; step <= steps; step++) {
                const check_x = start_x + distance_x * step / steps;
                const check_y = start_y + distance_y * step / steps;
                let bullet_collision = Get_Colliding_Element(bullet, check_x, check_y, ".wall, .tank_body", this.body);
                if (
                    check_x < 0 ||
                    check_y < 0 ||
                    check_x + bullet.offsetWidth > map.clientWidth ||
                    check_y + bullet.offsetHeight > map.clientHeight ||
                    bullet_collision
                ) {
                    if (bullet_collision?.classList.contains("tank_body")) {
                        bullet_collision.tank.health -= this.power;
                        if (bullet_collision.tank.health <= 0) {
                            bullet_collision.tank.container.remove();
                        }
                    }
                    bullet.remove();
                    this.active_bullets -= 1;
                    return;
                }
            }

            bullet.style.left = `${x}px`;
            bullet.style.top = `${y}px`;
            previous_time = time;
            requestAnimationFrame(move_bullet);
        };

        requestAnimationFrame(move_bullet);
    }
}

const p1 = new Tank("test", p1_color, 0, 0, 0);
const p2 = new Tank("test", p2_color, 100, 200, 180);

const tank_controls = [
    {
        tank: p1,
        keys: new Set(),
        controls: {
            up: ["w"], down: ["s"], left: ["a"], right: ["d"],
            rotate_left: ["q"], rotate_right: ["e"], fire: ["t"]
        }
    },
    {
        tank: p2,
        keys: new Set(),
        controls: {
            up: ["arrowup"], down: ["arrowdown"], left: ["arrowleft"], right: ["arrowright"],
            rotate_left: ["pageup"], rotate_right: ["pagedown"], fire: ["."]
        }
    }
];

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const tank_input = tank_controls.find(({ controls }) =>
        Object.values(controls).some((keys) => keys.includes(key))
    );
    if (!tank_input) return;

    event.preventDefault();
    tank_input.keys.add(key);
    if (!event.repeat && tank_input.controls.fire.includes(key)) {
        tank_input.tank.shoot();
    }
});

document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    for (const { keys } of tank_controls) keys.delete(key);
});

window.addEventListener("blur", () => {
    for (const { keys } of tank_controls) keys.clear();
});

p1.draw();
p2.draw();

let previous_frame_time;
function animate_tanks(time) {
    const delta_time = previous_frame_time === undefined
        ? 0
        : Math.min(time - previous_frame_time, 50);
    previous_frame_time = time;

    for (const { tank, keys, controls } of tank_controls) {
        tank.move(keys, controls, delta_time);
    }

    requestAnimationFrame(animate_tanks);
}

requestAnimationFrame(animate_tanks);