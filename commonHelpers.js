import{i as n,S as h,a as g}from"./assets/vendor-b0d10f48.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const f=2e3,y=350,l=40,u="44262715-0f0c36fa7bed0278a9188117f";async function p(r,e){if(r.preventDefault(),e.searchQuery=e.elements.searchForm[0].value.trim().toLowerCase(),e.elements.btnLoadMore.classList.add("is_hidden"),e.searchQuery){e.page=1,e.elements.searchForm.reset();try{const o=await d(e,l);if(!o.hits.length){n.error({message:"Sorry, there are no images matching your search query. Please try again."}),e.elements.gallery.innerHTML="<div></div>";return}n.success({message:`Hooray! We found ${o.totalHits} images.`}),e.elements.gallery.innerHTML=c(o.hits),e.lightbox.refresh()}catch(o){console.log(o),n.error({title:"🔻 Oops!",message:o.message??"Something went wrong!",position:"topCenter"})}}else n.warning({message:"Fill in the search field!"}),e.elements.gallery.innerHTML="<div></div>"}async function b(r){r.page+=1;try{const e=await d(r,l);r.elements.gallery.insertAdjacentHTML("beforeend",c(e.hits)),r.lightbox.refresh(),r.cardHeight=r.elements.gallery.firstElementChild.getBoundingClientRect(),scrollBy({top:r.cardHeight.height*3,behavior:"smooth"}),r.page>=e.totalHits/l&&r.elements.btnLoadMore.classList.add("is_hidden")}catch(e){console.log(e),n.error({title:"🔻 Oops!",message:e.message??"Something went wrong!",position:"topCenter"})}}function c(r){return r.map(({webformatURL:e,largeImageURL:o,tags:i,likes:t,views:s,comments:a,downloads:m})=>`
    <div class="photo-card">
        <a class="gallery-link" href="${o}">
            <div class="thumb">
                <img src="${e}" alt="${i}" loading="lazy" width="360" />
            </div>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b> ${t}
                    </p>
                    <p class="info-item">
                        <b>Views</b> ${s}
                    </p>
                    <p class="info-item">
                        <b>Comments</b> ${a}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b> ${m}
                    </p>
            </div>
        </a>
    </div>
    `).join("")}async function d(r,e){const o={params:{key:u,q:r.searchQuery,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:e,page:r.page}},{data:i}=await g.get("https://pixabay.com/api/",o);return r.page<=i.totalHits/e?r.elements.btnLoadMore.classList.remove("is_hidden"):i.totalHits&&(console.log(i.totalHits),n.error({message:"We're sorry, but you've reached the end of search results."})),i}(()=>{n.settings({timeout:f,position:"topRight",transitionIn:"fadeInRight",transitionOut:"fadeOutLeft",maxWidth:y});const r=new h(".photo-card a",{}),e={searchForm:document.querySelector(".search-form"),gallery:document.querySelector(".gallery"),btnLoadMore:document.querySelector(".load-more")},o={cardHeight:void 0,page:1,searchQuery:void 0,lightbox:r,elements:e};e.searchForm.addEventListener("submit",i=>p(i,o)),e.btnLoadMore.addEventListener("click",()=>b(o))})();
//# sourceMappingURL=commonHelpers.js.map
