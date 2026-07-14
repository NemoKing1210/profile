import { heroicons } from "../shared/data/heroicons.js";
import profile from "../shared/data/profile.js";
import {
  localeList,
  resolveInitialLocale,
} from "../shared/i18n/index.js";
import { celebrateConfetti, burstConfettiAt } from "../shared/lib/confetti.js";
import { initImageFade } from "../shared/lib/image-fade.js";
import { initReveal } from "../shared/lib/reveal.js";
import {
  ACTIVITY_DAYS,
  ACTIVITY_MAX,
  ACTIVITY_WEEKS,
  aboutActivityMethods,
  aboutActivityState,
  aboutViewMethods,
} from "../components/about/index.js";
import { commentsMethods, commentsState } from "../components/comments/index.js";
import {
  heroSpeechMethods,
  heroSpeechState,
  heroViewMethods,
  initHeroPhysics,
} from "../components/hero/index.js";
import { initInfiniteScroll } from "../components/infinite-echo/index.js";
import {
  echoFinaleMethods,
  echoFinaleState,
} from "../components/echo-finale/index.js";
import {
  achievementsMethods,
  achievementsState,
} from "../components/achievements/index.js";
import { interestsViewMethods } from "../components/interests/index.js";
import { linksViewMethods } from "../components/links/index.js";
import {
  minecraftMineMethods,
  minecraftMineState,
} from "../components/minecraft-mine/index.js";
import { projectsViewMethods } from "../components/projects/index.js";
import {
  scrollTopMethods,
  scrollTopState,
} from "../components/scroll-top/index.js";
import {
  stackFlipMethods,
  stackFlipState,
  stackViewMethods,
} from "../components/stack/index.js";
import { topbarMethods, topbarState } from "../components/topbar/index.js";
import { viewModelMethods } from "./view-model.js";

export function createProfilePage() {
  // Spread must not evaluate activity getters (object rest/spread calls them).
  // Copy descriptors so Alpine keeps real getters/methods.
  return Object.defineProperties(
    {
      ACTIVITY_WEEKS,
      ACTIVITY_DAYS,
      ACTIVITY_MAX,
      ...aboutActivityState(),
      ...minecraftMineState(),
      ...commentsState(),
      ...topbarState(),
      ...scrollTopState(),
      ...echoFinaleState(),
      ...achievementsState(),
      ...stackFlipState(),
      ...heroSpeechState(),
      localeList,
      name: profile.name,
      handle: profile.handle,
      birthYear: profile.birthYear,
      avatar: profile.avatar,
      banner: profile.banner,
      bannerLight: profile.bannerLight,
      favicon: profile.favicon,
      icons: heroicons,
      _stopConfetti: null,
      _infiniteScroll: null,
      _stopImageFade: null,

      onMetaChipActivate(chip, event) {
        if (chip?.kind !== "birth") return;
        const point = event?.currentTarget?.getBoundingClientRect?.();
        const x = point
          ? point.left + point.width / 2
          : event?.clientX ?? window.innerWidth / 2;
        const y = point
          ? point.top + point.height / 2
          : event?.clientY ?? window.innerHeight * 0.35;
        burstConfettiAt(x, y, { count: 96 });
        this._stopConfetti?.();
        this._stopConfetti = celebrateConfetti(3_500);
      },

      init() {
        this.setLocale(resolveInitialLocale(), { instant: true });
        this.applyStoredTheme?.();
        this._onNavResize = () => {
          if (window.matchMedia("(min-width: 860px)").matches) {
            this.closeNav();
          }
        };
        window.addEventListener("resize", this._onNavResize);
        this.$nextTick(() => {
          initReveal(this.$root);
          this._stopImageFade = initImageFade(this.$root);
          this._heroPhysics = initHeroPhysics(this.$refs.heroPhysics, {
            onInteract: () => this.onPhysicsInteract(),
          });
          this.bindAvatarSpeech();
          this._infiniteScroll = initInfiniteScroll({
            source: this.$root.querySelector("[data-infinite-source]"),
            echoes: this.$refs.infiniteEchoes,
            sentinel: this.$refs.infiniteSentinel,
            getMarks: () => this.t.ui.infiniteMarks || [],
            onMark: (text) => this.showSpeech(text),
          });
          this._bindStackFlip();
          this._bindScrollTop();
          this._bindNavSpy();
          this.initAboutActivity();
          this.bindLongStayAchievement?.();
          this.bindAchievementDebugApi?.();
        });
      },

      destroy() {
        window.removeEventListener("resize", this._onNavResize);
        this._onNavResize = null;
        this.destroyStackFlip();
        this.destroyScrollTop();
        this.destroyNavSpy();
        this.destroyLocaleChrome();
        this.destroyHeroSpeech();
        this.destroyComments();
        this._stopConfetti?.();
        this._stopConfetti = null;
        this._stopImageFade?.();
        this._stopImageFade = null;
        this._heroPhysics?.destroy?.();
        this._heroPhysics = null;
        this._infiniteScroll?.destroy?.();
        this._infiniteScroll = null;
        this.destroyEchoFinale();
        this.destroyAboutActivity();
        this.destroyMinecraftMine();
        this.destroyAchievements?.();
      },
    },
    {
      ...Object.getOwnPropertyDescriptors(aboutActivityMethods()),
      ...Object.getOwnPropertyDescriptors(aboutViewMethods()),
      ...Object.getOwnPropertyDescriptors(minecraftMineMethods()),
      ...Object.getOwnPropertyDescriptors(commentsMethods()),
      ...Object.getOwnPropertyDescriptors(topbarMethods()),
      ...Object.getOwnPropertyDescriptors(scrollTopMethods()),
      ...Object.getOwnPropertyDescriptors(echoFinaleMethods()),
      ...Object.getOwnPropertyDescriptors(achievementsMethods()),
      ...Object.getOwnPropertyDescriptors(stackFlipMethods()),
      ...Object.getOwnPropertyDescriptors(stackViewMethods()),
      ...Object.getOwnPropertyDescriptors(heroSpeechMethods()),
      ...Object.getOwnPropertyDescriptors(heroViewMethods()),
      ...Object.getOwnPropertyDescriptors(interestsViewMethods()),
      ...Object.getOwnPropertyDescriptors(projectsViewMethods()),
      ...Object.getOwnPropertyDescriptors(linksViewMethods()),
      ...Object.getOwnPropertyDescriptors(viewModelMethods()),
    }
  );
}
