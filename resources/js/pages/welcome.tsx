import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bath,
    BedDouble,
    KeyRound,
    Mountain,
    ShieldCheck,
    Sparkles,
    Sun,
    Users,
    Waves,
} from 'lucide-react';

import SplitText from '@/components/SplitText';
import SpotlightCard from '@/components/SpotlightCard';
import { dashboard, login, register } from '@/routes';

type FeaturedHome = {
    name: string;
    location: string;
    pricePerNight: string;
    guests: string;
    beds: string;
    baths: string;
    badge: string;
};

const featuredHomes: FeaturedHome[] = [
    {
        name: 'Villa Es Trenc Horizon',
        location: 'Colonia de Sant Jordi',
        pricePerNight: 'Desde 390 EUR/noche',
        guests: '8 huespedes',
        beds: '4 dormitorios',
        baths: '3 banos',
        badge: 'Piscina infinita',
    },
    {
        name: 'Casa Pedra Blava',
        location: 'Valldemossa',
        pricePerNight: 'Desde 280 EUR/noche',
        guests: '6 huespedes',
        beds: '3 dormitorios',
        baths: '2 banos',
        badge: 'Vistas Tramuntana',
    },
    {
        name: 'Atico Port Adriano',
        location: 'Calvia',
        pricePerNight: 'Desde 240 EUR/noche',
        guests: '4 huespedes',
        beds: '2 dormitorios',
        baths: '2 banos',
        badge: 'Frente al mar',
    },
];

const differentiators = [
    {
        icon: KeyRound,
        title: 'Check-in digital y flexible',
        description:
            'Acceso autonomo, instrucciones claras y soporte local en castellano, catalan e ingles.',
    },
    {
        icon: ShieldCheck,
        title: 'Reservas seguras y verificadas',
        description:
            'Anfitriones validados, pagos protegidos y politica de cancelacion transparente.',
    },
    {
        icon: Sparkles,
        title: 'Curacion boutique',
        description:
            'No listamos volumen: seleccionamos casas con estilo, ubicacion y experiencia real.',
    },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Alquiler vacacional en Mallorca">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=outfit:400,500,600,700,800|playfair-display:600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-28 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-300/12" />
                    <div className="absolute top-36 -left-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-400/10" />
                    <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-400/10" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border/0.35)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border/0.35)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
                </div>

                <header className="relative mx-auto w-full max-w-6xl px-6 pt-6 md:px-8 md:pt-8">
                    <nav className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3 backdrop-blur md:px-6">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                <Waves className="h-4 w-4" />
                            </span>
                            <div className="leading-tight">
                                <p className="font-semibold tracking-tight">Casas Mallorca</p>
                                <p className="text-xs text-muted-foreground">Alquiler vacacional premium</p>
                            </div>
                        </div>

                        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                            <a href="#destacadas" className="transition hover:text-foreground">
                                Destacadas
                            </a>
                            <a href="#como-funciona" className="transition hover:text-foreground">
                                Como funciona
                            </a>
                            <a href="#ventajas" className="transition hover:text-foreground">
                                Ventajas
                            </a>
                        </div>

                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-95"
                                >
                                    Ir al dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hidden rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent md:inline-flex"
                                    >
                                        Iniciar sesion
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-95"
                                        >
                                            Publica tu casa
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-20 pt-14 md:px-8">
                    <section className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
                                Temporada 2026 abierta
                            </p>

                            <SplitText
                                text="Tu refugio en Mallorca, con alma mediterranea"
                                tag="h1"
                                splitType="words, chars"
                                delay={32}
                                duration={0.9}
                                textAlign="left"
                                className="text-balance [font-family:Playfair_Display,serif] text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl"
                            />

                            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Encuentra villas frente al mar, fincas entre montanas y apartamentos con diseno local.
                                Reserva en minutos y vive Mallorca como un residente, no como un turista.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <a
                                    href="#destacadas"
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95"
                                >
                                    Ver casas destacadas
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <a
                                    href="#como-funciona"
                                    className="inline-flex rounded-xl border border-border bg-background/80 px-5 py-3 text-sm font-semibold transition hover:bg-accent"
                                >
                                    Como funciona
                                </a>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-border/70 bg-card/75 px-4 py-3 backdrop-blur">
                                    <p className="text-2xl font-bold">350+</p>
                                    <p className="text-xs text-muted-foreground">Alojamientos verificados</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-card/75 px-4 py-3 backdrop-blur">
                                    <p className="text-2xl font-bold">4.9/5</p>
                                    <p className="text-xs text-muted-foreground">Valoracion media real</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-card/75 px-4 py-3 backdrop-blur">
                                    <p className="text-2xl font-bold">24/7</p>
                                    <p className="text-xs text-muted-foreground">Atencion durante tu estancia</p>
                                </div>
                            </div>
                        </div>

                        <SpotlightCard
                            spotlightColor="rgba(251, 191, 36, 0.22)"
                            className="border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5"
                        >
                            <p className="text-sm font-medium text-muted-foreground">Escapada recomendada</p>
                            <h2 className="mt-2 [font-family:Playfair_Display,serif] text-3xl font-semibold leading-tight">
                                Semana en la Serra de Tramuntana
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                Ideal para desconectar: senderismo al amanecer, mercados locales y cenas al atardecer.
                            </p>

                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/70 px-3 py-2">
                                    <span className="inline-flex items-center gap-2">
                                        <Sun className="h-4 w-4 text-amber-500" />
                                        Clima templado
                                    </span>
                                    <span className="font-semibold">17-24 C</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background/70 px-3 py-2">
                                    <span className="inline-flex items-center gap-2">
                                        <Mountain className="h-4 w-4 text-emerald-500" />
                                        Actividades cercanas
                                    </span>
                                    <span className="font-semibold">+20 planes</span>
                                </div>
                            </div>
                        </SpotlightCard>
                    </section>

                    <section id="destacadas" className="space-y-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <SplitText
                                    text="Casas destacadas"
                                    tag="h2"
                                    splitType="words"
                                    delay={55}
                                    duration={0.8}
                                    textAlign="left"
                                    className="[font-family:Playfair_Display,serif] text-3xl font-semibold sm:text-4xl"
                                />
                                <p className="mt-2 text-muted-foreground">
                                    Una seleccion con diseno, ubicacion y experiencia de alto nivel.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-3">
                            {featuredHomes.map((home) => (
                                <SpotlightCard
                                    key={home.name}
                                    spotlightColor="rgba(14, 165, 233, 0.18)"
                                    className="p-0"
                                >
                                    <div className="h-44 bg-gradient-to-br from-sky-300/60 via-cyan-200/50 to-emerald-300/50 dark:from-sky-900/40 dark:via-cyan-900/30 dark:to-emerald-900/40" />
                                    <div className="space-y-4 p-6">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-semibold tracking-tight">{home.name}</h3>
                                                <p className="text-sm text-muted-foreground">{home.location}</p>
                                            </div>
                                            <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                                {home.badge}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                            <p className="inline-flex items-center gap-1">
                                                <Users className="h-3.5 w-3.5" />
                                                {home.guests}
                                            </p>
                                            <p className="inline-flex items-center gap-1">
                                                <BedDouble className="h-3.5 w-3.5" />
                                                {home.beds}
                                            </p>
                                            <p className="inline-flex items-center gap-1">
                                                <Bath className="h-3.5 w-3.5" />
                                                {home.baths}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold">{home.pricePerNight}</p>
                                            <button className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                                                Ver detalles
                                                <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            ))}
                        </div>
                    </section>

                    <section id="ventajas" className="space-y-6">
                        <div className="max-w-xl">
                            <h2 className="[font-family:Playfair_Display,serif] text-3xl font-semibold sm:text-4xl">
                                Una experiencia de alquiler sin friccion
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Hemos disenado cada paso para que elegir, reservar y disfrutar sea rapido y seguro.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {differentiators.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <SpotlightCard
                                        key={item.title}
                                        spotlightColor="rgba(16, 185, 129, 0.17)"
                                        className="space-y-3"
                                    >
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                                    </SpotlightCard>
                                );
                            })}
                        </div>
                    </section>

                    <section
                        id="como-funciona"
                        className="rounded-3xl border border-border/70 bg-gradient-to-br from-background via-card/60 to-background px-6 py-8 shadow-sm md:px-10"
                    >
                        <div className="grid gap-6 md:grid-cols-3">
                            {[
                                ['1', 'Elige zona y fechas', 'Filtra por estilo de casa, presupuesto y servicios deseados.'],
                                ['2', 'Reserva al instante', 'Confirma online con pago seguro y recibe toda la informacion.'],
                                ['3', 'Disfruta Mallorca', 'Recibe recomendaciones locales personalizadas para tu estancia.'],
                            ].map(([step, title, text]) => (
                                <div key={step} className="space-y-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                        {step}
                                    </span>
                                    <h3 className="text-lg font-semibold">{title}</h3>
                                    <p className="text-sm text-muted-foreground">{text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-border/70 bg-card/70 px-6 py-10 text-center backdrop-blur-sm">
                        <h2 className="[font-family:Playfair_Display,serif] text-3xl font-semibold sm:text-4xl">
                            Reserva tu proxima estancia en Mallorca
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                            Descubre alojamientos unicos, trato cercano y una plataforma pensada para viajeros exigentes.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="#destacadas"
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95"
                            >
                                Explorar propiedades
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            {!auth.user && canRegister && (
                                <Link
                                    href={register()}
                                    className="inline-flex rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold transition hover:bg-accent"
                                >
                                    Publicar alojamiento
                                </Link>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
