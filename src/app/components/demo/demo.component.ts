import { Component } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">🎉 Layout Modulaire avec Tailwind CSS</h1>
        <p class="text-lg text-gray-600 mb-6">
          Félicitations ! Vous avez successfully implémenté un système de layout modulaire avec :
        </p>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-blue-800 mb-3">🧩 Composants Modulaires</h3>
            <ul class="space-y-2 text-blue-700">
              <li>• SidebarComponent avec ng-content</li>
              <li>• HeaderComponent flexible</li>
              <li>• FooterComponent réutilisable</li>
              <li>• SidebarNavComponent & SidebarLinkComponent</li>
              <li>• OverlayComponent pour mobile</li>
            </ul>
          </div>

          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-green-800 mb-3">🎨 Tailwind CSS</h3>
            <ul class="space-y-2 text-green-700">
              <li>• Classes utilitaires maximisées</li>
              <li>• Design système cohérent</li>
              <li>• Responsive design</li>
              <li>• CSS personnalisé minimisé</li>
              <li>• Maintenaibilité optimisée</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">🚀 Fonctionnalités</h3>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-3xl mb-2">📱</div>
              <div class="font-medium">Responsive</div>
              <div class="text-sm text-gray-600">Mobile-first design</div>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">⚡</div>
              <div class="font-medium">Performant</div>
              <div class="text-sm text-gray-600">Optimisé avec Signals</div>
            </div>
            <div class="text-center">
              <div class="text-3xl mb-2">🔧</div>
              <div class="font-medium">Modulaire</div>
              <div class="text-sm text-gray-600">Composants réutilisables</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white">
        <h2 class="text-2xl font-bold mb-4">✨ Testons les Fonctionnalités !</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-2">Navigation :</h4>
            <p class="text-purple-100">Utilisez la sidebar pour naviguer entre les sections</p>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Mobile :</h4>
            <p class="text-purple-100">Redimensionnez la fenêtre pour voir le menu mobile</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DemoComponent {}
